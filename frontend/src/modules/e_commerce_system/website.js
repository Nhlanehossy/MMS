import { translationKeys } from "@/executables/translation";

export const website_config = [
  {
    name: "",
    path: "",
    icon: "fa fa-home",
    label: translationKeys.Home,
    renderMode: "webpage",
    widgets: [
      {
        type: "hero",
        props: {
        
          title: translationKeys.WelcomeToPansikaOnline||'Welcome to Pansika Online',
          subtitle: `Malawi's Leading Online Market Place`,
          description: translationKeys.DontMissOffers,
          imageUrl: "https://images.pexels.com/photos/5706040/pexels-photo-5706040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          imageAlt: translationKeys.ExclusiveOffers,
          button: {
            label: translationKeys.ViewOffers,
            link: "/home/products",
            icon: "fa fa-tags",
          },
        },
      },

      {
        type: "market",
        props: {},
      }
,
      {type:"footer",props:{}},


    ],
  },
  {
    name: "categories",
    path: "categories",
    icon: "fa fa-th-large",
    label: translationKeys.Categories,
    renderMode: "webpage",
    widgets: [
      {
        type: "cards",
        props: {
          title: translationKeys.ShopByCategory,
          cards: [
            {
              icon: "fa fa-mobile-alt",
              title: translationKeys.Electronics,
              description: translationKeys.LatestGadgets,
              link: "/home/products",
            },
            {
              icon: "fa fa-tshirt",
              title: translationKeys.Fashion,
              description: translationKeys.TrendyClothing,
              link: "/home/products",
            },
            {
              icon: "fa fa-home",
              title: translationKeys.HomeLiving,
              description: translationKeys.HomeEssentials,
              link: "/home/products",
            },
            {
              icon: "fa fa-utensils",
              title: translationKeys.KitchenDining,
              description: translationKeys.QualityKitchenware,
              link: "/home/products",
            },
          ],
        },
      },
    ],
  },
  {
    name: "products",
    path: "products",
    icon: "fa fa-shopping-bag",
    label: translationKeys.Products,
    renderMode: "webpage",
    widgets: [
      {
        type: "search",
        props: {},
      },
    ],
  },
  {
    name: "about",
    path: "about",
    icon: "fa fa-info-circle",
    label: translationKeys.AboutUs,
    renderMode: "webpage",
    widgets: [
      {
        type: "hero",
        props: {
          title: translationKeys.AboutPansikaOnline,
          subtitle: translationKeys.CommittedToYourExperience,
          imageUrl: "https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          imageAlt: translationKeys.PansikaOnlineTeam,
          button: {
            label: translationKeys.OurVision,
            link: "/about/vision",
            icon: "fa fa-bullseye",
          },
        },
      },
      {
        type: "faq",
        props: {
          title: translationKeys.FrequentlyAskedQuestions,
          questions: [
            {
              question: translationKeys.PaymentMethodsQuestion,
              answer: translationKeys.PaymentMethodsAnswer,
            },
            {
              question: translationKeys.TrackOrderQuestion,
              answer: translationKeys.TrackOrderAnswer,
            },
            {
              question: translationKeys.ReturnPolicyQuestion,
              answer: translationKeys.ReturnPolicyAnswer,
            },
            {
              question: translationKeys.InternationalShippingQuestion,
              answer: translationKeys.InternationalShippingAnswer,
            },
          ],
        },
      },
    ],
  },
];