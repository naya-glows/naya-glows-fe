import React from "react";
import HeroBanner from "./helpers/HeroBanner";
import HeroIngredients from "./helpers/HeroIngredients";
import FeaturedSection from "./helpers/FeatureSection";
import TransformationsSection from "./helpers/TransformationsSection";
import CatalogSection from "./helpers/CatalogSection";
import HowItWorksSection from "./helpers/HowItWorks";
import ProductSpotlightSection from "./helpers/ProductSpotlightSection";
import BestSellersSection from "./helpers/BestSellerSection";
import TestimonialsSection from "./helpers/TestiomonialsSection";
import WhyChooseSection from "./helpers/WhyChooseUs";
import BannerSection from "./helpers/BannerSection";
import CategoriesSection from "./helpers/FaceBodySkin";
import InfluencerSection from "./helpers/InfluencerSection";
import VideoShowcaseSection from "./helpers/VideoShowcaseSection";
import SignatureShowcaseSection from "./helpers/SignatureShowcaseSection";
import ImageShowcaseSection from "./helpers/ImageShowcaseSection";
import ServicesDirectorySection from "./helpers/ServicesDirectorySection";
import BusinessDirectorySection from "./helpers/BusinessDirectorySection";
import SectionGate from "./helpers/SectionGate";

type Props = {};

const Main = (props: Props) => {
  return (
    <>
      <SectionGate sectionKey="home.hero">
        <HeroBanner />
      </SectionGate>
      <SectionGate sectionKey="home.ingredients">
        <HeroIngredients />
      </SectionGate>
      <SectionGate sectionKey="home.featuredProducts">
        <FeaturedSection />
      </SectionGate>
      <VideoShowcaseSection
        src="https://res.cloudinary.com/bhozkz7o/video/upload/v1784381904/naya-glows/legacy/new/41341302-c730-4f62-8bc1-1d03bc983a7d.mov"
        poster="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381916/naya-glows/legacy/new/img_7419.jpg"
        eyebrow="Naya Glows"
        heading="Clean, intentional skincare, made to be felt, not just seen."
        subtext="Every formula starts with a real ingredient story. Watch a glimpse of ours."
      />
      <TransformationsSection />
      <CatalogSection />
      <SectionGate sectionKey="home.howItWorks">
        <HowItWorksSection />
      </SectionGate>
      <SectionGate sectionKey="home.servicesDirectory">
        <ServicesDirectorySection />
      </SectionGate>
      <SectionGate sectionKey="home.businessDirectory">
        <BusinessDirectorySection />
      </SectionGate>
      <ProductSpotlightSection />
      <SignatureShowcaseSection />
      <SectionGate sectionKey="home.bestSellers">
        <BestSellersSection />
      </SectionGate>
      <ImageShowcaseSection
        image="https://res.cloudinary.com/bhozkz7o/image/upload/v1785160476/naya-glows/recent/customer-ugc-testimonial-scrub.jpg"
        eyebrow="Naya Glows"
        heading="This is what consistency looks like."
        subtext="One more glimpse from the people already living the Naya routine."
      />
      <SectionGate sectionKey="home.testimonials">
        <TestimonialsSection />
      </SectionGate>
      <VideoShowcaseSection
        src="https://res.cloudinary.com/bhozkz7o/video/upload/v1785160487/naya-glows/recent/customer-testimonial-video.mov"
        poster="https://res.cloudinary.com/bhozkz7o/image/upload/v1785160476/naya-glows/recent/customer-ugc-testimonial-scrub.jpg"
        eyebrow="In Their Words"
        heading="Real customers, real routines, real glow."
        subtext="No script, no filter: just what happens when Naya becomes part of your routine."
      />
      <InfluencerSection />
      <SectionGate sectionKey="home.categories">
        <CategoriesSection />
      </SectionGate>
      <SectionGate sectionKey="home.whyChoose">
        <WhyChooseSection />
      </SectionGate>
      {/* <BannerSection /> */}
    </>
  );
};

export default Main;
