import { ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";

function ProdcutHeaders ({ headerType,text,name,backLink }: { headerType: string,text:string,name:string,backLink:string }) {
    return (
          <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Link
                      to={`${backLink}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Back to {name}</span>
                    </Link>
                  </div>
        
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {headerType}
                      </h1>
                      <p className="text-gray-600">
                        {text}
                      </p>
                    </div>
                  </div>
                </div>
    )
}
export default ProdcutHeaders;  