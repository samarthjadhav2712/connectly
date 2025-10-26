import { Link, useLocation } from "react-router"; // Make sure imports are correct
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { ShieldCheck, BellIcon, LogOutIcon } from "lucide-react"; // Make sure imports are correct
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");

    const queryClient = useQueryClient();

    const { mutate: logoutMutation } = useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    });

    return (
        <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Changed from justify-between to simple flex */}
                <div className='flex items-center w-full'>
                    {/*LOGO - only in the chat page*/}
                    {isChatPage && (
                        <Link to='/' className='flex items-center gap-2.5'>
                            <ShieldCheck className='size-9 text-primary' />
                            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                                Connectly
                            </span>
                        </Link>
                    )}
                    {/* === FIX: This group is wrapped in a div with ml-auto === */}
                    <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
                          {/* NOTIFICATION ICON - Stays on the left */}
                        <Link to={"/notifications"}>
                            <button className='btn btn-ghost btn-circle'>
                                <BellIcon className='h-6 w-6 text-base-content opacity-70' />
                            </button>
                        </Link>

                        <ThemeSelector />

                        {/*AVATAR */}
                        <div className='avatar'>
                            <div className='w-9 rounded-full'>
                                <img src={authUser?.profilePic} alt='User Avatar' />
                            </div>
                        </div>

                        {/*LOGOUT */}
                        <div className='btn btn-ghost btn-circle' onClick={logoutMutation}>
                            <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;