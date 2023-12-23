const Navbar = () => {
  return (
    <div className="flex flex-row items-center bg-[#000517] text-white font-semibold">
      <div className="w-2/5 ml-10 mr-24">
        <h1>Blue Blog</h1>
      </div>
      <div className="flex flex-row space-x-5 h-14 justify-center items-center">
        <a href="/home">Home</a>
        <a href="/profile">Profile</a>
        <a href="/about">About</a>
      </div>
      <div className="ml-auto mr-10">
        <a href="/">Logout</a>
      </div>
    </div>
  );
};

export default Navbar;
