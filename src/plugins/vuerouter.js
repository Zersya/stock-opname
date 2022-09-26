import { createWebHashHistory, createRouter } from 'vue-router'

import HelloWorld from "../components/HelloWorld.vue";
import Products from "../components/Products.vue";
import ProductSpecifications from "../components/ProductSpecifications.vue";
import Transactions from "../components/Transactions.vue";

const routes = [
    { path: '/', component: HelloWorld },
    { path: '/products', component: Products },
    { path: '/product-specifications', component: ProductSpecifications },
    { path: '/transactions', component: Transactions },
]

const router = createRouter({
    history: createWebHashHistory(),

    routes: routes
})

export default router
