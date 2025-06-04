import SongList from "@/components/SongList";

export default function Home () {

    return (
        <>
            <div className="w-full h-120 bg-cover bg-center text-white flex flex-col items-center justify-center text-center px-4" style={{ backgroundImage: "url('/headphone.jpg')" }}>
               <h1 className="text-4xl font-bold italic text-[#ECF0F1]">MOCKTIFY</h1>
               <p className="text-lg italic font-normal text-[#ECF0F1]">Keep up with your favorite songs through Mocktify</p>
            </div>
            <div className="mx-auto mt-6 px-10">
                <h1 className="text-3xl font-bold ">New Release Song</h1>
                <div className="mt-4 mb-5">
                    <SongList/>
                </div>
            </div>

        </>
    )
}