<template>
  <div class="mt-44">
    <DataFetcher resource="image-galleries" :limit="limit">
      <template #default="{ data, error }">
        <div v-if="error">
          <p>Error: {{ error.message }}</p>
        </div>
        
        <div v-else>
          <span v-if="data">
                <Container v-for="gallery in data">
                    <GallerySection
                    :id="gallery.id"
                    :name="gallery.name"
                    :description="gallery.description"
                    :images="gallery.images"
                    />
                </Container>
          </span>
        </div>
      </template>
    </DataFetcher>
  </div>
</template>

<script>
import GallerySection from "./GallerySection.vue";
import DataFetcher from "../components/DataFetcher.vue";
import Container from "../components/UI/Container.vue";

export default {
  components: {
    DataFetcher,
    GallerySection,
    Container
  },
};
</script>
