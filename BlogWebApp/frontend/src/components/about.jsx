import Navbar from "./navbar";
import { Card } from "@mui/material";
import alizaImage from "/aliza.jpg";
import biancaImage from "/bianca.jpg";

const about = () => {
  return (
    <div
      className="h-max"
      style={{
        background:
          "linear-gradient(0deg, #000517 0%, #000517 20%, #1b1a38 60%)",
      }}
    >
      <Navbar />
      <div>
        <h1 className="font-bold text-7xl text-center mb-4 mt-24 text-white">
          Meet the Team
        </h1>
        <h3 className="text-center font-semibold italic text-white">
          The people who made it happen.
        </h3>
        <div className="bg-[#6788ff] w-2/12 ml-auto mr-auto h-2 mt-24 mb-10 text-transparent">
          a
        </div>
        <div>
          <h2 className="font-bold text-5xl text-center mb-4 mt-16 text-white">
            About Us
          </h2>
          <div className="bg-gray-700 w-56 ml-auto mr-auto h-0.5 mt-10 mb-10 text-transparent">
            a
          </div>
          <h3 className="w-2/5 text-center font-normal text-sm text-white ml-auto mr-auto">
            Our Information Management 2 Group is composed of 3 members, namely:{" "}
            <span className="font-bold text-[#6788ff]">
              Mark Kenneth Badilla, Aliza May Bataluna, and Bianca Jessa
              Carabio.
            </span>{" "}
            Our team worked hard to create the project and together with our
            combined knowledge with Python using Flask for backend and Reactjs
            for frontend, we were able to perfect the webapp. We hope this
            project is up to the standards, as we have put 100% of our effort
            and passion on this. Thank you.
          </h3>
        </div>
        <div className="mt-24 flex flex-row space-x-16 justify-center">
          <div>
            <Card
              className="w-[300px] h-[400px] flex flex-col justify-center items-center"
              sx={{
                backgroundColor: "#1b1a38",
                borderRadius: "20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img src={alizaImage} alt="Aliza" className="w-full h-full" />
            </Card>
            <p className="mt-5 text-lg font-bold text-white text-center">
              Mark Badilla
            </p>
            <p className="text-sm font-light text-white text-center">
              Developer
            </p>
            <p className="w-[270px] font-semibold italic text-center ml-3 text-white mt-5 mb-44">
              &quot;Dami nang nakatingin na gusto na manapak pero chill lang ako
              dito kasi i don&apos;t give a fuck&quot;
            </p>
          </div>
          <div>
            <Card
              className="w-[300px] h-[400px] flex flex-col justify-center items-center"
              sx={{
                backgroundColor: "#1b1a38",
                borderRadius: "20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img src={alizaImage} alt="Aliza" className="w-full h-full" />
            </Card>
            <p className="mt-5 text-lg font-bold text-white text-center">
              Aliza Bataluna
            </p>
            <p className="text-sm font-light text-white text-center">
              Developer
            </p>
            <p className="w-[270px] font-semibold italic text-center ml-3 text-white mt-5 mb-44">
              &quot;location check? about 2 km/s&quot;
            </p>
          </div>
          <div>
            <Card
              className="w-[280px] h-[400px] flex flex-col justify-center items-center"
              sx={{
                backgroundColor: "#1b1a38",
                borderRadius: "20px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img src={biancaImage} alt="Aliza" className="w-full h-full" />
            </Card>
            <p className="mt-5 text-lg font-bold text-white text-center">
              Bianca Carabio
            </p>
            <p className="text-sm font-light text-white text-center">
              Developer
            </p>
            <p className="w-[270px] font-semibold italic text-center ml-3 text-white mt-5 mb-44">
              &quot;Ikaw at Ako. 11 years. B &lt;3 B.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default about;
