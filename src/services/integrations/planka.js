const axios = require('axios');

const CHANGES = {
    'cardUpdate': (name1, name2) => 'У задачи поменялcя статус с <u>"[name1]"</u> на <u>"[name2]"</u>'.replace('[name1]', name1).replace('[name2]', name2),
    'cardCreate': (n1, n2) => 'Появилась новая задача!'
}

class Planka {
    constructor() {
        this.baseURL = process.env.PLANKA_API_URL || 'https://planka.m2ss.ru/api';
        this.token = null;
        this.cookie = null;
        this.authenticate(process.env.PLANKA_API_LOGIN, process.env.PLANKA_API_PASSWORD);
    }

    async authenticate(emailOrUsername, password) {
        try {
            const response = await axios.post(`${this.baseURL}/access-tokens`, {
                emailOrUsername,
                password,
                withHttpOnlyToken: true
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            this.token = response.data.item;
            this.cookie = response.headers['set-cookie'][0];            
            
            return response.data;
        } catch (error) {
            console.error('Authentication error:', error.response?.data || error.message);
            throw error;
        }
    }

    getHeaders() {
        if (!this.token) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }

        return {
            'Authorization': `Bearer ${this.token}`,
            'Cookie': this.cookie,
            'Content-Type': 'application/json'
        };
    }

    async getBoardInfo(boardId) {
        try {
            const response = await axios.get(
                `${this.baseURL}/boards/${boardId}`,
                { headers: this.getHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Get board info error:', error.response?.data || error.message);
            throw error;
        }
    }

    async moveCard(cardId, listId, position = 1) {
        try {
            const response = await axios.patch(
                `${this.baseURL}/cards/${cardId}`,
                {
                    listId,
                    position
                },
                { headers: this.getHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Move card error:', error.response?.data || error.message);
            throw error;
        }
    }

    getNameList(included, data) {
        for (let item of included.lists) {            
            if (data && data.item.listId == item.id) {
                return item.name;
            }
        }
    }

    getMessageChangeData(eventName, included, beforeData, afterData) {
        let messages = '';
        for (let index in CHANGES) {
            if (eventName == index) {
                messages += CHANGES[index](this.getNameList(included, beforeData), this.getNameList(included, afterData))
            }
        }

        return messages;
    }

    async formatData(_package) {
        const current = _package.data;
        const prevent = _package.prevData;
        const user = _package.user;
        
        if (!process.env.PLANKA_API_PROJECT_ID.split(',').includes(current.included.projects[0].id)) {
            return null;
        }

        let res = await this.getBoardInfo(current.item.boardId)        
        
        const included = res.included; 
        
        const message = this.getMessageChangeData(_package.event, included, prevent, current);

        if (!message) {
            return null;
        }

        let packageResult = {
            title: current.item.name,
            link: process.env.PLANKA_PUBLIC + '/cards/' + current.item.id,
            authors: included.users,
            project: {
                id: current.included.projects[0].id,
                name: current.included.projects[0].name
            },
            initAuthor: user,
            message: message
        }

        return packageResult;
    }

    async getAllLists(boardId) {
        const boardInfo = await this.getBoardInfo(boardId);
        return boardInfo.included.lists || [];
    }

    async findListByName(boardId, listName) {
        const lists = await this.getAllLists(boardId);
        return lists.find(list => list.name.toLowerCase() === listName.toLowerCase());
    }

    setToken(token) {
        this.token = token;
    }
}

module.exports = new Planka();