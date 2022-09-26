<template>
  <v-app>
    <v-navigation-drawer>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home" @click="$router.push('/')" />
        <v-list-item prepend-icon="mdi-code-brackets" title="Products" value="products" @click="$router.push('/products')" />
        <v-list-item prepend-icon="mdi-book-open-variant" title="Product Specs" value="product-specs" @click="$router.push('/product-specifications')" />
        <v-list-item prepend-icon="mdi-cart" title="Transactions" value="transactions" @click="$router.push('/transactions')" />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Products from "./components/Products.vue";

export default {
  name: 'App',

  components: {
    Products,
    HelloWorld,
  },


}
</script>
