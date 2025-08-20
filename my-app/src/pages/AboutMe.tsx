import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const AboutMe: React.FC = () => {
  const images = [
    "/zach_images/trainer1.JPG",
    "/zach_images/trainer2.JPG",
    "/zach_images/trainer3.JPG",
    "/zach_images/trainer4.JPG",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">About The Trainer</h2>

      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        {/* Info Section */}
        <div className="md:w-1/2">
          <h3 className="text-2xl font-semibold mb-2">Zach Floss</h3>
          <p className="text-gray-700 mb-2">
            📧{" "}
            <a
              href="mailto:zachfloss@email.com"
              className="text-blue-600 underline"
            >
              zachfloss@email.com
            </a>
          </p>
          <p className="text-gray-700 mb-6">📞 (708) 710-0948</p>
          <p className="text-gray-600 leading-relaxed">
            I just finished my collegiate soccer career at the University of
            Dubuque, a Division 3 school in Dubuque, Iowa. I was a 3-year
            starter and 2-year captain, as well as a multi-year all-conference
            honorable mention player.
            <br />
            <br />
            At Carl Sandburg High School, I was a 2-year varsity starter,
            senior-year captain, and all-sectional player. The training I
            provide is fully catered to each player's needs. Being well-versed
            in many positions, I design drills and repetitions that reflect
            real-game scenarios.
            <br />
            <br />
            Throughout my playing career, I've done extensive individual and
            small group training with teammates, giving me a wide variety of
            drills to help players sharpen their skills and elevate their game.
          </p>
        </div>

        {/* Carousel Section */}
        <div style={{ width: "80%", margin: "0 auto" }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`Slide ${index}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
