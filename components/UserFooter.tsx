
import { Footer, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";

export function UserFooter() {
  return (
    <Footer container>
      <div className="w-full justify-items-center text-center">
          <h1 className="text-white font-bold text-4xl italic">Mocktify</h1>
          <FooterLinkGroup className="italic mt-5 gap-4 font-semibold" style={{ color: "#BDC3C7" }}>
            <FooterLink href="https://github.com/urosousetsu">Billy Timotius</FooterLink>
            <FooterLink href="https://github.com/blackat123">Valiant Gilchrist</FooterLink>
            <FooterLink href="https://github.com/NikoHoc">Nikolas Henrik</FooterLink>
            <FooterLink href="https://github.com/ChynthiaOscar">Chynthia Oscar</FooterLink>
            <FooterLink href="https://github.com/aldodol">Leonardo Anggriawan</FooterLink>
          </FooterLinkGroup>
        <FooterDivider />
        <FooterCopyright href="#" by="Kelomok 2 - Client Side Programming" year={2025} />
      </div>
    </Footer>
  );
}
