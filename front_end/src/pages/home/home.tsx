import HomePageSlider from "./comps/homePageSlider";
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
        <ServicesSection/>
      </div>
    </div>
  );
}
export default Home;


