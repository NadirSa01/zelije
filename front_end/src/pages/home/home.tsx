import HomePageSlider from "./comps/homePageSlider";
import OurStorySection from "./comps/ourStory";
import Section from "./comps/section";
import ServicesSection from "./comps/servicesSection";


function Home() {
  return (
    <div>
      <div>
        <HomePageSlider />
      </div>
      <div>
        <Section />
      </div>
      <div>
        <OurStorySection />
      </div>
      <div>
        <ServicesSection/>
      </div>
    </div>
  );
}
export default Home;


