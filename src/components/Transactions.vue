<template>
  <v-table>
    <thead>
    <tr>
      <th class="text-left">
        Product Name
      </th>
      <th class="text-left">
        Quantity
      </th>
      <th class="text-left">
        Action
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in transactions" :key="item.$id">
      <td>
        {{ item.product_name }}
      </td>
      <td>
        {{ item.quantity }}
      </td>
      <td>
        <v-btn @click="deleteTransaction(item)" color="error" text>
          Delete
        </v-btn>
      </td>
    </tr>
    <tr>
      <td>
        <v-select
            v-model="newTransaction.product"
            :items="products.map(product => { return { title: product.name, value: product }})"
            variant="outlined"
            density="comfortable"
            chips
            label="Pilih Produk"
        ></v-select>
      </td>
      <td>
        <v-text-field
            v-model="newTransaction.quantity"
            hint="Contoh : 10"
            label="Jumlah Produk"
            variant="outlined"
            density="comfortable"
            class="my-5"
            @keydown.enter="addTransaction"
        />
      </td>
      <td>
        <v-btn class="mb-7" @click="addTransaction" color="success" text>
          Add
        </v-btn>
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
import {database} from "../utils.js";

export default {
  name: "Transactions",

  data: () => ({
    transactions: [],
    newTransaction: {
      product: null,
      quantity: "",
    },
    products: []
  }),

  mounted() {
    this.fetchTransactions()
    this.fetchProducts()
  },

  methods: {
    fetchTransactions () {
      database
          .listDocuments('632dfb68d34a801347b5', 'transactions')
          .then((result) => {

            this.transactions = result.documents;
          });
    },

    addTransaction () {

      const product = {
        product_name: this.newTransaction.product.name,
        product_description: this.newTransaction.product.description,
        product_id: this.newTransaction.product.$id,
        quantity: this.newTransaction.quantity,
      };

      this.transactions.push(product);

      database
          .createDocument('632dfb68d34a801347b5', 'transactions', 'unique()', product)
          .then((result) => {
            this.fetchTransactions();
          });

      // unfocus input textfield
      document.activeElement.blur();
      this.newTransaction = {
        product: null,
        quantity: "",
      }

    },

    deleteTransaction (transaction) {
      this.transactions.splice(this.transactions.indexOf(transaction), 1);

      database
          .deleteDocument('632dfb68d34a801347b5', 'transactions', transaction.$id)
          .then((result) => {
            this.fetchTransactions();
          }).catch((error) => {
        console.log(error);
        this.transactions.push(transaction);
      });
    },

    fetchProducts () {
      database
          .listDocuments('632dfb68d34a801347b5', 'products')
          .then((result) => {

            this.products = result.documents;
          });
    },
  }

}
</script>

<style scoped>

</style>
