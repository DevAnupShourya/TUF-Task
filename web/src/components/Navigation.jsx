import { Button } from "@nextui-org/react";
import { NavLink, Link } from "react-router-dom";

import Logo from '../assets/logo.webp';

import { MdTableChart } from "react-icons/md";
import { PiUploadFill } from "react-icons/pi";

export default function Navigation() {
  return (
    <nav className="flex flex-nowrap justify-between items-center bg-indigo-100 px-8 max-md:px-4 py-4 shadow-xl">
      <div id="logo" className="max-w-1/4">
        <Link to={'/'}>
          <img src={Logo} alt="TakeUForward" width={42} height={42} />
        </Link>
      </div>
      <div id="links" className="min-w-max flex gap-8 max-md:gap-4">
        <Button as={NavLink} to={'/'} color="primary" variant="bordered" startContent={<PiUploadFill />}>Upload </Button>
        <Button as={NavLink} to={'/entries'} color="secondary" variant="light" startContent={<MdTableChart />}> Entries </Button>
      </div>
    </nav>
  )
}
