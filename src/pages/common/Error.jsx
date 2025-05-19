import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 p-6 rounded-lg mb-6 inline-block">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>Something went wrong. The requested resource could not be loaded.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;