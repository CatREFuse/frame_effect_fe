import { createStore } from 'vuex';

export default createStore({
    state: {
        colorScheme: 'light',
    },
    mutations: {
        switchToDark() {
            this.state.colorScheme = 'dark';
        },
        switchToLight() {
            this.state.colorScheme = 'light';
        },
    },
    actions: {},
    modules: {},
});
