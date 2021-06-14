export var Methods  = {
    user: {
        authorize: 'user.authorize',
        register: 'user.register'
    },
    task: {
        get: 'task.get',
        list: 'tasks.getAvailableTasks',
        runs: {
            get: 'runs.get',
            submit: 'runs.submit'
        },
        compilers: {
            list: 'compilers.list'
        }
    },
    contest: {
        get: 'contest.get',
        list: 'contests.list',
        results: 'contest.standings'
    }
}