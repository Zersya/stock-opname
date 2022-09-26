<template>
  <v-row>
    <v-col>
      <h2 class="pa-2">List Product</h2>
      <v-table>
        <thead>
        <tr>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Jumlah
          </th>
          <th class="text-left">
            Description
          </th>
          <th class="text-left">
            Spec
          </th>
          <th class="text-left">
            Action
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,_) in products" :key="item.$id">
          <td>
            {{ item.name }}
          </td>
          <td>
            {{ item.quantity ?? 0 }}
          </td>
          <td>
            {{ item.description }}
          </td>
          <td>
            {{  getMergeProductSpecs(item).join(', ') }}
          </td>
          <td>
            <v-btn @click="deleteProduct(item)" color="error" text>
              Delete
            </v-btn>
          </td>
        </tr>
        <tr>
          <td style="vertical-align:top">
            <v-text-field
                :class="isProductSpecsEmpty"
                v-model="newProduct.name"
                hint="Contoh : Rujak Coel"
                label="Nama Produk"
                variant="outlined"
                density="comfortable"
                @keydown.enter="addProduct"
            />
          </td>
          <td style="vertical-align:top">
            <v-text-field
                :class="isProductSpecsEmpty"
                v-model="newProduct.quantity"
                hint="Contoh : 10"
                label="Jumlah Produk"
                variant="outlined"
                density="comfortable"
                @keydown.enter="addProduct"
            />
          </td>
          <td style="vertical-align:top">
            <v-text-field
                :class="isProductSpecsEmpty"
                v-model="newProduct.description"
                hint="Contoh : Campuran buah segar dengan saus gula merah"
                label="Deskripsi Produk"
                variant="outlined"
                density="comfortable"
                @keydown.enter="addProduct"
            />
          </td>
          <td>
            <v-select
                :class="isProductSpecsEmpty"
                v-model="newProduct.product_specification"
                :items="productSpecs.map(item => { return { title: item.name, value: item } })"
                variant="outlined"
                density="comfortable"
                label="Pilih Spec"
                multiple
            />
            <div v-for="(item, index) in newProduct.product_specification">
              <v-text-field
                  v-model="newProduct.product_specification_amounts[index]"
                  hint="Contoh : 1"
                  :label="'Nilai ' + item.name + ' ( ' + item.unit + ' )'"
                  variant="outlined"
                  density="comfortable"
                  @keydown.enter="addProduct"
              />
            </div>
          </td>
          <td style="vertical-align:top">
            <v-btn :class="isProductSpecsEmpty" @click="addProduct" color="success" text>
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

export default {
  name: "Products",

  data: () => ({
    products: [],
    newProduct: {
      name: "",
      quantity: "",
      description: "",
      product_specification: [],
      product_specification_amounts: [],
      product_specification_units: []
    },
    productSpecs: [],
    indexSpecAmount: 0
  }),

  mounted() {
    this.fetchProductSpecs();
    this.fetchProducts()
  },

  methods: {
    fetchProductSpecs () {
      database
          .listDocuments('632dfb68d34a801347b5', 'product-specification')
          .then((result) => {

            this.productSpecs = result.documents;
          });
    },

    fetchProducts () {
      database
          .listDocuments('632dfb68d34a801347b5', 'products')
          .then((result) => {
            this.products = result.documents;
          });
    },

    addProduct () {
      if (this.newProduct.product_specification_amounts.length !== this.newProduct.product_specification.length) {
        alert('Jumlah spec tidak sama dengan jumlah nilai spec');
        return;
      }

      const temp = this.newProduct;
      const product = {
        name: temp.name,
        quantity: temp.quantity,
        description: temp.description,
        product_specification_ids: temp.product_specification.map(item => item.$id),
        product_specification_names: temp.product_specification.map(item => item.name),
        product_specification_amounts: temp.product_specification_amounts,
        product_specification_units:temp.product_specification.map(item => item.unit),
      };

      this.products.push(product);

      database
          .createDocument('632dfb68d34a801347b5', 'products', 'unique()', product)
          .then((result) => {
            this.fetchProducts();
          }).catch((error) => {
        console.log(error);
        this.newProduct = temp;
        this.products.pop();
      });

      // unfocus input textfield
      document.activeElement.blur();
      this.newProduct = {
        name: "",
        description: "",
        product_specification_ids: [],
        product_specification_names: [],
        product_specification_units: [],
        product_specification: [],
        product_specification_amounts: [],
      };
    },

    deleteProduct (product) {
      this.products.splice(this.products.indexOf(product), 1);

      database
          .deleteDocument('632dfb68d34a801347b5', 'products', product.$id)
          .then((result) => {
            this.fetchProducts();
          }).catch((error) => {
        console.log(error);
        this.products.push(product);
      });
    },

    getMergeProductSpecs (item) {
      let val = []

      for (let i = 0; i < item.product_specification_ids.length; i++) {
        val.push(item.product_specification_names[i] + " " + item.product_specification_amounts[i] + " " + item.product_specification_units[i])
      }

      return val
    }
  },

  computed: {
    isProductSpecsEmpty () {
      if (this.newProduct.product_specification?.length === 0) {
        return "mt-5"
      }

      return "mt-8"
    }
  }
}
</script>

<style scoped>

</style>
