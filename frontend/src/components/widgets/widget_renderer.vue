<template>
    <div>
      <component
        v-for="(widget, index) in widgets"
        :key="index"
        :is="getComponent(widget.type)"
        v-bind="widget.props"
      />
    </div>
  </template>
  
  <script setup>
  import { defineProps, markRaw } from 'vue';
  import HeroWidget from './hero.vue';
  import CardsWidget from './cards.vue';
  import TestimonialWidget from './testimonial.vue';
  import FeaturesWidget from './features.vue';
  import CtaWidget from './cta.vue';
  import GalleryWidget from './gallery.vue';
  import StatsWidget from './stats.vue';
  import TeamWidget from './team.vue';
  import FaqWidget from './faq.vue';
  import NewsletterWidget from './news_letter.vue';
  import TimelineWidget from './timeline.vue';
  import PricingWidget from './pricing.vue';
  import CarouselWidget from './carouesel.vue';
  import Market from './market.vue';
  import HeroCarousel from './hero_carousel.vue';
  import FeaturedProducts from './featured_products.vue';
  import Market_place from '../portal/render_modes/shop/market_place.vue';
  import product from '../portal/render_modes/shop/product.vue';
  import footer from './footer.vue';
  
  const props = defineProps({
    widgets: {
      type: Array,
      required: true,
    },
  });
  
  const componentMap = {
    hero: markRaw(HeroWidget),
    cards: markRaw(CardsWidget),
    testimonial: markRaw(TestimonialWidget),
    features: markRaw(FeaturesWidget),
    cta: markRaw(CtaWidget),
    gallery: markRaw(GalleryWidget),
    stats: markRaw(StatsWidget),
    team: markRaw(TeamWidget),
    faq: markRaw(FaqWidget),
    newsletter: markRaw(NewsletterWidget),
    timeline: markRaw(TimelineWidget),
    pricing: markRaw(PricingWidget),
    carousel: markRaw(CarouselWidget),
    market: markRaw(Market),
    'hero-carousel': markRaw(HeroCarousel),
    'featured-products': markRaw(FeaturedProducts),
    'search':markRaw(Market_place),
    'product':markRaw(product),
    'footer':markRaw(footer),
  };
  
  const getComponent = (type) => {
    return componentMap[type] || null;
  };
  </script>