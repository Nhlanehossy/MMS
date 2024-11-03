
---

# Component Documentation

## 1. Cards Component (`cards.vue`)
- **Props:**
  - `title`: **String** - A string representing the title of the card section.
  - `cards`: **Array** - An array of card objects, each containing:
    - `icon`: **String** - The icon class for the card.
    - `title`: **String** - The title of the card.
    - `description`: **String** - A brief description of the card.
    - `link`: **String** - The URL the card links to.

## 2. Carousel Component (`carousel.vue`)
- **Props:**
  - `title`: **String** - A string for the title displayed at the top of the carousel.
  - `items`: **Array** - An array of objects, each representing a carousel item with properties:
    - `imageUrl`: **String** - The URL of the carousel image.
    - `title`: **String** - The title of the carousel item.
    - `description`: **String** - A description of the carousel item.
    - `button`: **Object** - An object containing:
      - `link`: **String** - The URL the button links to.
      - `label`: **String** - The label of the button.
  - `autoplay`: **Boolean** - Indicates whether the carousel should automatically transition between items.
  - `interval`: **Number** - The time interval (in milliseconds) between automatic transitions.

## 3. Call to Action Component (`cta.vue`)
- **Props:**
  - `title`: **String** - The title displayed in the Call to Action section.
  - `description`: **String** - A description or additional information about the action.
  - `button`: **Object** - Contains properties for the button:
    - `link`: **String** - The URL the button links to.
    - `label`: **String** - The text label for the button.
    - `icon`: **String** - The class for the icon to be displayed on the button.
  - `backgroundColor`: **String** - A CSS class representing the background color of the section.

## 4. FAQ Component (`faq.vue`)
- **Props:**
  - `title`: **String** - The title of the FAQ section.
  - `questions`: **Array** - An array of question objects, each containing:
    - `question`: **String** - The FAQ question.
    - `answer`: **String** - The answer to the FAQ question.
    - `isOpen`: **Boolean** - Indicates if the question is open or closed.

## 5. Features Component (`features.vue`)
- **Props:**
  - `title`: **String** - The title of the features section.
  - `features`: **Array** - An array of feature objects, each containing:
    - `icon`: **String** - The icon class for the feature.
    - `title`: **String** - The title of the feature.
    - `description`: **String** - A description of the feature.

## 6. Gallery Component (`gallery.vue`)
- **Props:**
  - `title`: **String** - The title of the gallery section.
  - `images`: **Array** - An array of image objects, each containing:
    - `url`: **String** - The URL of the image.
    - `alt`: **String** - Alternative text for the image.
    - `caption`: **String** - A caption for the image.

## 7. Hero Component (`hero.vue`)
- **Props:**
  - `title`: **String** - The main title to be displayed in the hero section.
  - `subtitle`: **String** - Additional context or information beneath the title.
  - `imageUrl`: **String** - The URL of the background image for the hero section.
  - `imageAlt`: **String** - Alternative text for the background image, used for accessibility.
  - `button`: **Object** - An object containing properties for the button:
    - `link`: **String** - The URL to navigate to when the button is clicked.
    - `icon`: **String** - The class for the icon to be displayed on the button.
    - `label`: **String** - The text label for the button.

## 8. Pricing Component (`pricing.vue`)
- **Props:**
  - `title`: **String** - The title of the pricing section.
  - `description`: **String** - A brief description of the pricing plans.
  - `plans`: **Array** - An array of plan objects, each containing:
    - `name`: **String** - The name of the plan.
    - `price`: **String** - The price of the plan.
    - `period`: **String** - The billing period (e.g., monthly, yearly).
    - `features`: **Array** - A list of features included in the plan.
    - `highlighted`: **Boolean** - Indicates if the plan is highlighted.
    - `button`: **Object** - Contains:
      - `label`: **String** - The text for the action button.
      - `link`: **String** - The URL the button links to.

## 9. Stats Component (`stats.vue`)
- **Props:**
  - `title`: **String** - The title of the stats section.
  - `stats`: **Array** - An array of statistic objects, each containing:
    - `label`: **String** - The label for the statistic.
    - `value`: **String** - The numerical value of the statistic.
    - `icon`: **String** - The class for the icon representing the statistic.

## 10. Team Component (`team.vue`)
- **Props:**
  - `title`: **String** - The title of the team section.
  - `members`: **Array** - An array of member objects, each containing:
    - `name`: **String** - The name of the team member.
    - `position`: **String** - The member's position or title.
    - `imageUrl`: **String** - The URL of the member's profile image.
    - `socialLinks`: **Array** - An array of social media link objects, each with:
      - `platform`: **String** - The name of the social media platform.
      - `url`: **String** - The URL to the member's profile on the respective platform.

## 11. Testimonial Component (`testimonial.vue`)
- **Props:**
  - `quote`: **String** - The testimonial quote.
  - `author`: **String** - The name of the person giving the testimonial.
  - `position`: **String** - The position or title of the author.
  - `imageUrl`: **String** - The URL of the author's image.

## 12. Timeline Component (`timeline.vue`)
- **Props:**
  - `title`: **String** - The title of the timeline section.
  - `events`: **Array** - An array of event objects, each containing:
    - `year`: **String** - The year of the event.
    - `title`: **String** - The title of the event.
    - `description`: **String** - A description of the event.

---



## 12. Market Component (`market.vue`)
- **Props:**
no props it just renders an eccomerce market place or store

---



Here’s a structured documentation for the `WidgetRenderer` component, following documentation standards:

---

# WidgetRenderer Component

The `WidgetRenderer` component dynamically renders a collection of widgets based on the parsed types and their associated properties. It provides a flexible way to display various UI components without hardcoding them into the template.

## Template Structure

The component uses Vue's `<component>` tag to render different widget components based on their type. The rendered components receive their props dynamically.

### Template Code

```vue
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
```

## Props

The `WidgetRenderer` accepts the following prop:

| Name    | Type   | Required | Description                                                  |
|---------|--------|----------|--------------------------------------------------------------|
| `widgets` | Array  | Yes      | An array of widget objects, each containing a `type` and `props`. |

### Widget Object Structure

Each object in the `widgets` array should have the following structure:

| Property | Type   | Description                                                |
|----------|--------|------------------------------------------------------------|
| `type`   | String | The type of the widget to be rendered (e.g., "hero", "cards"). |
| `props`  | Object | An object containing the properties to be passed to the widget component. |

## Script Logic

The component utilizes the `defineProps` function to define and enforce the expected structure of the `widgets` prop. It also creates a mapping between widget types and their corresponding component implementations.

### Script Code

```vue
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
import CarouselWidget from './carousel.vue';
import Market from './market.vue';
import HeroCarousel from './hero_carousel.vue';
import FeaturedProducts from './featured_products.vue';

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
};

const getComponent = (type) => {
  return componentMap[type] || null;
};
</script>
```

### Component Mapping

The `componentMap` object associates each widget type with its corresponding component, allowing for dynamic rendering based on the type specified in the `widgets` prop.

## Usage Example

```vue
<template>
  <WidgetRenderer :widgets="widgetList" />
</template>

<script setup>
import WidgetRenderer from './WidgetRenderer.vue';

const widgetList = [
  {
    type: 'hero',
    props: {
      title: 'Welcome to Our Site',
      subtitle: 'Your subtitle here',
      imageUrl: 'path/to/image.jpg',
      imageAlt: 'A descriptive alt text',
      button: {
        link: '/get-started',
        icon: 'icon-class',
        label: 'Get Started',
      },
    },
  },
  {
    type: 'cards',
    props: {
      title: 'Our Services',
      cards: [
        {
          icon: 'service-icon',
          title: 'Service 1',
          description: 'Description for service 1.',
          link: '/service-1',
        },
        // Additional card objects...
      ],
    },
  },
  // Additional widget objects...
];
</script>
```

## Conclusion

The `WidgetRenderer` component is a versatile and powerful tool for rendering a variety of widgets based on their types. It enhances the modularity of the application by allowing different components to be rendered dynamically with their respective props.

--- 

Feel free to modify any sections as needed!