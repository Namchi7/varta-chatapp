export default function Loader() {
  return (
    <div className="absolute inset-0 w-full h-full flex justify-center items-center bg-white z-50">
      <div className="w-[70px] h-[70px] flex justify-center items-center p-[6px] border-solid border-[transparent] border-t-red-500 border-[5px] rounded-full animate-loaderAnim1">
        <div className="w-full h-full flex justify-center items-center p-[6px] border-solid border-[transparent] border-t-red-500 border-[5px] rounded-full animate-loaderAnim2">
          <div className="w-full h-full flex justify-center items-center border-solid border-[transparent] border-t-red-500 border-[5px] rounded-full animate-loaderAnim3"></div>
        </div>
      </div>
    </div>
  );
}
