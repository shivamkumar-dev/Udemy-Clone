import Navigator from "../images/Navigator.svg"
import Quiz from "../images/Quiz.svg"
import Playlist from "../images/Playlist.svg"
import Certificate from "../images/Certificate.svg"
import FeaturIconDes from "../components/FeatureIconDes"
function Index() {
    return (
        <div className="relative flex text-center h-full p-12 dark-color">
            <div className="bg--dark bg-rotated" >
            </div>
            <div className="flex-1 justify-between">
                <h1 className="text-white text-5xl italic text-center mb-12">One n All Learning Platform</h1>
                <div className="relative flex justify-around mt-12  -rotate-3">
                    <FeaturIconDes description={"Roadmap"} icon={Navigator} />
                    <FeaturIconDes description={"Watch Playlist"} icon={Playlist} />
                    <FeaturIconDes description={"Take Quiz"} icon={Quiz} />
                    <FeaturIconDes description={"Get Ready For Job"} icon={Certificate} />
                </div>
            </div>
        </div>
    )
}

export default Index;