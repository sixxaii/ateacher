export var IDs  = {
    contests: {
        getAll: 1,
        get: 2,
        remove: 3,
        task: {
            list: 4,
            remove: 5,
            add: 6
        },
        results: 7,
        create: 8
    },
    task: {
        get: 9,
        list: 10,
        runs: {
            get: 23,
            submit: 24
        },
        compilers: {
            list: 25
        },
        import: 26
    },
    authentication: {
        login: 11,
        register: 12,
        getUserInfo: 13 
    },
    doc: {
        methodsList: 14,
        methodInfo: 15
    },
    groups: {
        list: 16,
        get: 17,
        remove: 18,
        members: {
            remove: 19,
            users: 20,
            add: 21
        },
        create: 22,
        userList: 35
    },
    courses: {
        getAll: 23,
        get: 24,
        remove: 25,
        create: 26,
        edit: 27,
        addTheme: 28,
        removeTheme: 29,
        addLesson: 30,
        removeLesson: 31,
        removeEntity: 32,
        addEntity: 33,
        started: 34
    }
}