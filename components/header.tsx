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
        <header
            className={"flex justify-between items-center shadow-md h-24 flex-shrink-0 " +
                "lg:justify-around"}>
            <div className={"flex justify-center w-2/5"}>
                <HomeIcon
                    className={"w-8 text-gray-700 cursor-pointer"}
                    onClick={handleGoHome}/>
            </div>
            <div className={"flex justify-center w-2/5"}>
                <Button
                    onClick={buttonOnClick}>
                    {buttonText}
                </Button>
            </div>
        </header>
    )
};

export default Header;