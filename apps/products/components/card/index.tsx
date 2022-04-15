import { useRouter } from 'next/router'

const Card: React.FC = () => {
  const router = useRouter()

  return (
    <div className="flex max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="w-full p-4">
        <h2 className="text-gray-900 font-bold text-2xl">
          Bike, Olympic
        </h2>
        <p className="mt-2 text-gray-600 text-sm">
          Road Bike
        </p>
        <div className="flex item-center justify-between mt-3">
          <h3 className="text-gray-700 font-bold text-xl">
            $220
          </h3>

          <button
            onClick={() => router.push(`/update/${2}`)}
            className="px-3 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded"
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
