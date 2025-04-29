const axios = require('axios');

const CHANGES = {
    'cardUpdate': (name1) => 'Задача сменила стадию в `[name1]`'.replace('[name1]', name1)
}

class Planka {
    constructor() {
        this.baseURL = process.env.PLANKA_API_URL || 'https://planka.m2ss.ru/api';
        this.token = null;
    }

    // Метод авторизации
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

            this.token = response.data.token;
            return response.data;
        } catch (error) {
            console.error('Authentication error:', error.response?.data || error.message);
            throw error;
        }
    }

    // Получение заголовков для запросов
    getHeaders() {
        if (!this.token) {
            throw new Error('Not authenticated. Call authenticate() first.');
        }

        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    // Получение информации о доске
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

    // Перемещение карточки
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
            if (data.item.listId == item.id) {
                return item.name;
            }
        }
    }

    getMessageChangeData(eventName, included, afterData) {
        let messages = '';
        for (let index in CHANGES) {
            if (eventName == index) {
                messages += CHANGES[index](this.getNameList(included, afterData))
            }
        }

        return messages;
    }

    formatData(_package) {
        const current = _package.data;
        const prevent = _package.prevData;
        const user = _package.user;
        const included = current.included;

        let packageResult = {
            title: current.item.name,
            link: null,
            authors: [],
            initAuthor: {
                'name': user.name,
                'linkName': user.username
            },
            message: this.getMessageChangeData(_package.event, included, current)
        }

        return packageResult;
    }

    // Вспомогательные методы
    async getAllLists(boardId) {
        const boardInfo = await this.getBoardInfo(boardId);
        return boardInfo.included.lists || [];
    }

    async findListByName(boardId, listName) {
        const lists = await this.getAllLists(boardId);
        return lists.find(list => list.name.toLowerCase() === listName.toLowerCase());
    }

    // Метод для инициализации с существующим токеном
    setToken(token) {
        this.token = token;
    }
}

module.exports = new Planka;