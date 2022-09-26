<template>
  <v-row>
    <v-col>
      <h2 class="pa-2">List Product Specifications</h2>
      <v-table>
        <thead>
        <tr>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Amount
          </th>
          <th class="text-left">
            Unit
          </th>
          <th class="text-left">
            Action
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in productSpecs" :key="item.$id">
          <td>
            {{ item.name }}
          </td>
          <td>
            {{ item.amount }}
          </td>
          <td>
            {{ item.unit }}
          </td>
          <td>
            <v-btn @click="deleteProductSpec(item)" color="error" text>
              Delete
            </v-btn>
          </td>
        </tr>
        <tr>
          <td>
            <v-text-field
                v-model="newProductSpec.name"
                hint="Contoh : Gula"
                label="Nama Produk Spesifikasi"
                variant="outlined"
                density="comfortable"
                class="my-5"
                @keydown.enter="addProductSpec"
            />
          </td>
          <td>
            <v-text-field
                v-model="newProductSpec.amount"
                hint="Contoh : 100"
                label="Jumlah Produk Spesifikasi"
                variant="outlined"
                density="comfortable"
                class="my-5"
                @keydown.enter="addProductSpec"
            />
          </td>
          <td>
            <v-text-field
                v-model="newProductSpec.unit"
                hint="Contoh : Gram"
                label="Satuan Produk Spesifikasi"
                variant="outlined"
                density="comfortable"
                class="my-5"
                @keydown.enter="addProductSpec"
            />
          </td>
          <td>
            <v-btn class="mb-7" @click="addProductSpec" color="success" text>
              Add
            </v-btn>
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script>
import {database} from "../utils.js";
import {Query} from "appwrite";

export default {
  name: "ProductSpecifications",

  data: () => ({
    productSpecs: [],
    newProductSpec: {
      name: "",
      unit: "",
      amount: ''
    }
  }),

  mounted() {
    this.fetchProductSpecs()
  },

  methods: {
    fetchProductSpecs () {
      database
          .listDocuments('632dfb68d34a801347b5', 'product-specification')
          .then((result) => {

            this.productSpecs = result.documents;
          });
    },

    addProductSpec () {
      const temp = this.newProductSpec;
      this.productSpecs.push(this.newProductSpec);

      database
          .createDocument('632dfb68d34a801347b5', 'product-specification', 'unique()', this.newProductSpec)
          .then((result) => {

            this.fetchProductSpecs();
          }).catch((error) => {
        console.log(error);
        this.newProductSpec = temp;
        this.productSpecs.pop();
      });

      // unfocus input textfield
      document.activeElement.blur();
      this.newProductSpec = {
        name: "",
        unit: "",
        amount: 0,
      };
    },

    deleteProductSpec (item) {
      this.productSpecs.splice(this.productSpecs.indexOf(item), 1);
      database
          .deleteDocument('632dfb68d34a801347b5', 'product-specification', item.$id)
          .then((result) => {
            this.fetchProductSpecs();
          }).catch((error) => {
        console.log(error);
        this.productSpecs.push(item);
      });


    },
  }

}
</script>

<style scoped>

</style>
