import { Disclosure } from "@headlessui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnect, useAccount } from "wagmi";

export default function Header() {
    // const { connect } = useConnect();
    // const { isConnected } = useAccount();

    return (
        <Disclosure as="nav" className="border-b border-black">
            {() => (
                <>
                    <div className="mx-auto px-2 sm:px-6 lg:px-8 border-b-2 border-b-stone-700 text-stone-300">
                        <div className="relative flex h-16 justify-between">
                            <div className="flex flex-shrink-0 items-center">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                    </svg>
                                </span>
                                <h3 className="text-lg font-bold">GeneriFi</h3>
                            </div>

                            <div className="flex absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <ConnectButton
                                    showBalance={{
                                        smallScreen: true,
                                        largeScreen: true,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    );
}
