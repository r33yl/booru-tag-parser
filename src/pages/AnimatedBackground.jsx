export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Circles */}
            <div className="absolute top-[-10%] right-[15%] w-36 h-36 bg-green-400 rounded-full opacity-20 animate-float" />
            <div className="absolute top-[5%] left-[9%] w-40 h-40 bg-blue-400 rounded-full opacity-15 animate-float-fast" />
            <div className="absolute top-[30%] right-[5%] w-56 h-56 bg-pink-400 rounded-full opacity-15 animate-float-slow" />
            <div className="absolute  bottom-[5%] left-[3%] w-28 h-28 bg-red-400 rounded-full opacity-20 animate-float-slow" />
            <div className="absolute bottom-[-17%] right-[22%] w-72 h-72 bg-purple-500 rounded-full opacity-20 animate-float" />

            {/* Squares */}
            <div className="absolute top-[15%] right-[35%] w-28 h-28 bg-red-400 opacity-20 animate-float" />
            <div className="absolute bottom-[30%] left-[18%] w-36 h-36 bg-green-400 opacity-10 animate-float-slow" />
            <div className="absolute bottom-[7%] right-[5%] w-40 h-40 bg-yellow-400 opacity-20 animate-float-fast" />


            {/* Triangles */}
            {/* <div className="absolute w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-transparent border-b-blue-400 opacity-40 animate-float"></div>
            <div className="absolute bottom-[15%] left-[20%] w-0 h-0 border-l-[120px] border-r-[120px] border-b-[210px] border-transparent border-b-yellow-400 opacity-40 animate-float"></div>
            <div className="absolute w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-transparent border-b-blue-400 opacity-40 animate-float"></div> */}
        </div>
    );
}
