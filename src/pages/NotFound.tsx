import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import errorImage from '@/assets/error.png';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column - Content */}
        <div className="space-y-6 order-2 md:order-1 text-center">
          <h1 className="text-7xl font-bold text-blue-800">404 <span className="text-5xl">LỖI</span></h1>
          <h2 className="text-3xl font-semibold text-blue-700">Không tìm thấy trang</h2>
          <p className="text-lg text-blue-600">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          
          <div className="flex justify-center pt-4">
            <Button asChild variant="default" className="bg-teal-500 hover:bg-teal-600 text-white">
              <Link to="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="flex justify-center order-1 md:order-2">
          <img 
            src={errorImage} 
            alt="Lỗi 404" 
            className="max-w-md w-full h-auto object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;