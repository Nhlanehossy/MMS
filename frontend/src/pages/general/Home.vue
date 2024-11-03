<template>
    <SlideShow
    :slides="[
    {
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/caroselItems%2FDJI_0588.jpg?alt=media&token=19f8a0de-cd61-4360-a37c-3a05140da8bf',
      title: 'Akuka Guest Lodge',
      description: 'The Better Accommodation Option'
    },
    {
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/caroselItems%2FDJI_0580.jpg?alt=media&token=6862ec25-d8e0-4c34-9561-809f995cd7e5',
      title: 'Akuka Guest Lodge',
      description: 'The better lesuire destination'
    },
  ]"
  :autoplayDelay="5000"
    
    />

  <div style="margin-left: 5vw; margin-right: 5vw">
    <ServicesSection />
    <OurRoomsSection />
    <CenterWelcomeText />
    <OurTeamSection />
  </div>

  <CustomerReviewSection />
  <Footer />
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  width: 10px;
  z-index: -999999;
  height: 10px;
  transition: 0.9s;
  cursor: pointer;
}

::-webkit-scrollbar:hover {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: gray;
  z-index: -999999;
  border-radius: 8px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
  z-index: -999999;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.topContainer {
  width: 100%;
  padding: 20px;
  height: auto;
  background-color: #81d742;
  font-family: "Arial Rounded MT Bold", sans-serif;
  color: whitesmoke;
  display: flex;
  justify-content: space-evenly;
}

.topContainerSub {
  width: 50%;
  font-size: 110%;
  font-weight: 500;
  text-align: center;
  letter-spacing: 8px;
}

.topContainerSubA {
  width: 50%;
  justify-content: space-evenly;
  text-shadow: 0.5px 0.5px 2px gray;
  display: flex;
}

.imgholder {
  width: 100%;
}

.barss {
  display: none;
}

.lognbtn {
  background-color: #fff;
  color: #001f3f;
  box-shadow: 1px 1px 3px gray;
}

.lognbtn:hover {
  background-color: dodgerblue;
  color: #fff;
}

.welcm {
  width: 100%;
  height: auto;
}

.iconFont {
  color: #fff;
}

.topContainerSecond {
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.topContainerSecondA {
  width: 30%;
}

.topContainerSecondB {
  width: 70%;
  align-items: center;
  text-align: center;
}

textarea {
  resize: vertical;
}

.modal {
  position: fixed;
  width: 50%;
  background-color: #fff;
  border-radius: 5px;
  height: auto;
  color: #001f3f;
  transform: translate(-50%, 5%);
  left: 50%;
  top: 5%;
  z-index: 999999;
  transition: 1s;
  display: none;
  box-shadow: 1px 1px 100px rgb(112, 108, 108);
}

.subTopnav {
  padding: 10px;
  width: 100%;
  border-bottom: 2px solid rgb(233, 233, 240);
  display: flex;
  justify-content: space-between;
}

.closeSign {
  font-size: 150%;
  cursor: pointer;
}

form {
  padding: 12px;
}

select {
  width: 100%;
  border: 1px solid gray;
  outline: none;
  padding: 4px;
  border-radius: 3px;
}

.modalBody {
  display: flex;
  justify-content: left;
  width: 100%;

  flex-wrap: wrap;
}

.modalContainers {
  width: 45%;
  margin-top: 10px;
}

input[type="date"] {
  width: 100%;
  border: 1px solid gray;
  outline: none;
  padding: 4px;
  border-radius: 3px;
}

input {
  width: 100%;
  border: 1px solid #001f3f;
  outline: none;
  margin-top: 5px;
  padding: 7px;
  border-radius: 2px;
}

.cover {
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100vh;
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
}

.iconSocial {
  cursor: pointer;
}

.iconSocial:hover {
  color: dodgerblue;
}

.ulist {
  display: inline;
  color: #001f3f;
  padding: 10px;
}

.list {
  list-style-type: none;
  text-decoration: none;
  display: inline-block;
  font-weight: 500;
  padding: 10px;
  transition: 0.3s;
  text-shadow: 0.3px 0.3px 1px gray;
  cursor: pointer;
}

.list:hover {
  border-bottom: 1px solid #81d742;
  color: #81d742;
}

.slider {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("@/assets/Images/slide1.jpg");
  opacity: 1;
  transition: opacity 1s ease;
}

.slide.active {
  opacity: 1;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  z-index: 1;
}

.prev,
.next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: #81d742;
  font-size: 150%;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.welcome_text {
  font-size: 300%;
}

.headings {
  font-size: 300%;
}

.welcome_text2 {
  font-size: 140%;
}

.btn {
  padding: 15px 25px;
  background-color: #81d742;
  border-radius: 50px;
  margin: 30px;
  border: none;
  cursor: pointer;
  transition: 0.4s;
  color: #fff;
}

.btn:hover {
  background-color: #fff;
  color: #1b1b1b;
  box-shadow: 3px 3px 10px #726e6e;
}

.btnuq {
  border-radius: 5px;
}

.ourserservicesHolder {
  width: 100%;
  padding: 30px;
  font-family: "Arial Rounded MT Bold", sans-serif;
}

.center {
  text-align: center;
  color: #001f3f;
  padding: 0 30px;
}

.room_q {
  display: flex;
  justify-content: space-between;
  padding: 6px;
}

.color {
  color: #81d742;
  text-shadow: 0.3px 0.3px 1px gray;
}

.orange {
  color: orange;
}

.service_c {
  display: flex;
  width: 100%;
  padding: 10px;
  height: auto;
  justify-content: space-evenly;
}

.service_card {
  width: 28%;
  height: 90vh;
  transition: 0.5s;
  box-shadow: 1px 1px 5px #686565;
  border-radius: 4px;
  padding: 0px;
}

.vmore {
  cursor: pointer;
  transition: 0.5s;
  padding: 6px;
  display: inline;
  border-radius: 5px;
  border: none;
}

.vmore:hover {
  border: 2px solid dodgerblue;
}

.iconCard {
  width: 65px;
  position: relative;
  background-color: #81d742;
  padding: 13px 8px;
  top: -34px;
  left: calc(50% - 25px);
  transition: 0.4s;
  height: 65px;
  -moz-transform: rotate(45deg);
  color: white;
  -webkit-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  border-radius: 4px;
  transform: rotate(45deg);
}

.iconp {
  -moz-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  font-size: 180%;
  transform: rotate(-45deg);
  text-align: center;
}

.iconCard:hover {
  border-radius: 50%;
}

.service_card:hover {
  box-shadow: 0 12px 30px #ccc;
  transform: translateY(-5px);
}

.customerReview {
  width: 100%;
  height: auto;
  background-image: url("@/assets/Images/testimonial.jpg");
  background-size: cover;
}

.imgholder2 {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}

.user_avata {
  border: 3px solid #81d742;
  border-radius: 50%;
  margin-top: 15px;
}

.center2 {
  text-align: center;
  color: #fff;
}

.customer_card {
  width: 28%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  border-top: 3px solid #81d742;
  transition: 0.5s;
  box-shadow: 1px 1px 5px #686565;
  color: #fff;
  border-radius: 2px;
  padding: 0px;
}

.footer {
  width: 100%;
  height: auto;
  background-color: #1b1b1b;
}

.footerUpper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
}

.upperFooterContainers {
  width: 45%;
  height: auto;
}

.spacing {
  letter-spacing: 2px;
  font-size: 140%;
  font-weight: 600;
}

.lowwerFooter {
  width: 100%;
  padding: 20px;
  border-bottom: 3px solid #81d742;
  border-top: 3px solid #81d742;
  text-align: center;
  color: #fff;
  background-color: transparent;
}

.connect {
  text-align: center;
  letter-spacing: 30px;
  color: #fff;
  font-size: 200%;
}

.contact {
  color: #fff;
  text-align: center;
  padding: 20px;
  line-height: 15px;
}

@media screen and (max-width: 720px) {
  .footerUpper {
    display: block;
    justify-content: space-between;
  }

  .upperFooterContainers {
    width: 100%;
    height: auto;
  }

  .welcome_text {
    font-size: 200%;
  }

  .welcome_text2 {
    font-size: 100%;
  }

  .topContainer {
    display: block;
    font-size: 90%;
  }

  .topContainerSub {
    width: 100%;
    margin-bottom: 10px;
  }

  .topContainerSubA {
    flex-direction: column;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .topContainerSecond {
    flex-direction: column;
  }

  .topContainerSecondA {
    width: 100%;
    align-items: center;
    text-align: center;
  }

  .topContainerSecondB {
    width: 100%;
    align-items: left;
    height: 0;
    overflow: hidden;
    transition: 0.3s;
    text-align: left;
  }

  .list {
    display: block;
    border-bottom: 1px solid rgb(189, 180, 180);
    font-weight: 400;
    cursor: pointer;
  }

  .list:hover {
    background-color: #81d742;
    color: #fff;
  }

  .barss {
    padding: 6px 12px;
    background-color: #81d742;
    border-radius: 4px;
    color: #fff;
    display: inline;
    float: right;
    top: 10px;
    cursor: pointer;
    font-size: 150%;
  }

  .service_c {
    display: block;
    padding: 10px;
  }

  .service_card,
  .customer_card {
    width: 100%;
    margin-top: 30px;
  }

  .modal {
    width: 98%;
  }

  .lognbtn {
    position: fixed;
    top: 20px;
    right: 2px;
  }
}
</style>

<script>
import Carousel from "@/components/Carousel.vue";
import HeroSection from "@/components/HeroSection.vue";
import ServicesSection from "@/components/ServicesSection.vue";
import OurRoomsSection from "@/components/OurRoomsSection.vue";
import OurTeamSection from "@/components/OurTeamSection.vue";
import CustomerReviewSection from "@/components/CustomerReviewSection.vue";
import CenterWelcomeText from "@/components/CenterWelcomeText.vue";
import Footer from "@/components/Footer.vue";
import SlideShow from "@/components/SlideShow.vue";

export default {
  components: {
    Carousel,
    Footer,
    SlideShow,
    HeroSection,
    ServicesSection,
    OurRoomsSection,
    OurTeamSection,
    CustomerReviewSection,
    CenterWelcomeText,
  },
  mounted() {
    if (localStorage.getItem("role")&&localStorage.getItem("role")!=="Guest")  {
      this.$router.push('/dashboard')
    } 
  },
};
</script>

<script></script>
