import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Index',
        redirect: '/lab',
    },
    {
        path: '/lab',
        name: 'Lab',
        component: () => import('../views/Lab.vue'),
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('../views/Test.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
