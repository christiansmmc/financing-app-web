import {HomeIcon} from "@heroicons/react/24/outline";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

interface HeaderProps {
    buttonText: string
    buttonOnClick: () => void
}

const Header = ({
                    buttonText,
                    buttonOnClick
                }: HeaderProps) => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/")
    }

    return (
        <div
            className={"flex justify-between items-center shadow-md h-20 flex-shrink-0 " +
                "lg:justify-around"}>
            <div className={"flex justify-center w-2/5"}>
                <HomeIcon
                    className={"w-8 text-gray-700 cursor-pointer"}
                    onClick={handleGoHome}/>
            </div>
            <div className={"flex justify-center w-2/5"}>
                <div className="flex items-center justify-center h-10 cursor-pointer px-5 rounded-md transition-all duration-300 ease-in-out active:scale-95 bg-slate-900 text-white
                    hover:bg-gray-700"
                    onClick={buttonOnClick}>
                    {buttonText}
                </div>
            </div>
        </div>
    )
};

export default Header;