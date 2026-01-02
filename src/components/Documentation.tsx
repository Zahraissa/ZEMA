import React from 'react';

const DocumentsSection = () => {
  return (
    <section className="relative py-16">
      <div 
        className="absolute inset-0 bg-cover bg-center z-[-1]"
        style={{ backgroundImage: 'url(assets/images/backgrounds/documents-two-bg.jpg)' }}
      ></div>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-8">
          <div className="flex-1 min-w-[200px]">
            <p className="text-2xl font-normal">City government recent documents download</p>
          </div>
          <div className="flex-2 min-w-[300px]">
            <ul className="list-none p-0 m-0">
              <li>
                <div className="flex items-center justify-between p-5 bg-white mb-5 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      <span className="icon-download-circular-button"></span>
                    </div>
                    <div>
                      <h3 className="text-lg font-normal m-0">
                        <a href="about.html" className="text-gray-800 hover:text-blue-600 no-underline">Vehicle Parking License</a>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Download the license details file</p>
                    </div>
                  </div>
                  <div className="text-2xl text-red-500">
                    <span className="icon-pdf-file"></span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center justify-between p-5 bg-white mb-5 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      <span className="icon-download-circular-button"></span>
                    </div>
                    <div>
                      <h3 className="text-lg font-normal m-0">
                        <a href="about.html" className="text-gray-800 hover:text-blue-600 no-underline">City Board Applications</a>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Download the license details file</p>
                    </div>
                  </div>
                  <div className="text-2xl text-red-500">
                    <span className="icon-pdf-file"></span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;