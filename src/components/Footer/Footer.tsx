const Footer = () => {
  return (
    <footer className="h-[200px] flex-1 border-t bg-secondary p-5 text-quinary">
      <div className="container mb-5 mt-5 text-center">
        <h4 className="flex items-center justify-center text-tertiary">
          M4-PT20b
        </h4>
        {/* <h4 className="flex text-tertiary items-center justify-center">
          VTJesusShop
        </h4> */}
        <p className="text-tertiary">
          <span className="text-primary/50">©</span> 2024 YisusShop{" "}
          <span className="text-primary/50">|</span> VTJESUS{" "}
          <span className="text-primary/50">|</span> vtjesus2. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
