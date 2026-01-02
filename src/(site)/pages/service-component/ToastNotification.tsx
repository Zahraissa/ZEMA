import { FC, useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

interface ToastNotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const ToastNotification: FC<ToastNotificationProps> = ({
    message,
    type,
    isVisible,
    onClose,
    duration = 3000
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setTimeout(onClose, 300); // Wait for animation to complete
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible && !isAnimating) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white border-green-600';
            case 'error':
                return 'bg-red-500 text-white border-red-600';
            case 'info':
                return 'bg-blue-500 text-white border-blue-600';
            default:
                return 'bg-gray-500 text-white border-gray-600';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5" />;
            case 'error':
                return <X className="h-5 w-5" />;
            default:
                return null;
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${isVisible && isAnimating
                    ? 'translate-x-0 opacity-100 scale-100'
                    : 'translate-x-full opacity-0 scale-95'
                }`}
        >
            <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border max-w-sm ${getTypeStyles()}`}
            >
                {getIcon()}
                <p className="font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-2 hover:bg-black hover:bg-opacity-20 rounded-full p-1 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default ToastNotification;
