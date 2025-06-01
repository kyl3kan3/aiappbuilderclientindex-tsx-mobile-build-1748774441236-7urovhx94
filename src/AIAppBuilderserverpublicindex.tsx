import React from 'react';

export default function AIAppBuilderserverpublicindex() {
  return (
    <div className="p-4">
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI App Builder - Build & Launch Native Apps with AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-text {
            background: linear-gradient(135deg, #3B82F6, #8B5CF6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    </style>
</head>
<body className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
    <div id="root">
        <!-- Header -->
        <header className="container mx-auto px-4 py-6">
            <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📱</span>
                    </div>
                    <span className="text-xl font-bold gradient-text">AI App Builder</span>
                </div>
                <div className="flex items-center space-x-4">
                    <a href="/requirements" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Sign In</a>
                    <a href="/requirements" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">Start Building</a>
                </div>
            </nav>
        </header>

        <!-- Hero Section -->
        <section className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
                    🚀 No Mac Required • No Xcode Needed • No Code Writing
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
                    Build & Launch iOS/Android Apps with AI
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                    AI App Builder auto-generates, signs, and delivers production-ready mobile apps 
                    straight to TestFlight — all from your browser. No code, no Mac, no problem.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <a href="/requirements" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 text-lg">
                        🚀 Start Building Free
                    </a>
                    <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-lg">
                        ▶️ Watch Demo
                    </button>
                </div>

                <!-- Trust Indicators -->
                <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
                    <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Real App Store Apps
                    </div>
                    <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Apple Code Signed
                    </div>
                    <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Production Ready
                    </div>
                    <div className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Enterprise Grade
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                <p className="text-gray-600 text-lg">From idea to App Store in minutes, not months</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                        👥
                    </div>
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                        1
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Describe Your App</h3>
                    <p className="text-gray-600">Answer a few guided questions about your app idea, features, and target audience.</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                        ⚡
                    </div>
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                        2
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Generate & Customize</h3>
                    <p className="text-gray-600">AI builds your screens, logic, and assets in seconds. Preview and customize as needed.</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                        🚀
                    </div>
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                        3
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Ship to App Store</h3>
                    <p className="text-gray-600">Signed IPAs pushed to TestFlight via GitHub Actions — no Mac or Xcode needed.</p>
                </div>
            </div>
        </section>

        <!-- Supported Platforms -->
        <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-3xl mx-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Supported Platforms</h2>
                <p className="text-gray-600 text-lg">Build once, deploy everywhere</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="text-4xl mb-3">🍎</div>
                    <h3 className="font-semibold mb-2">iOS</h3>
                    <p className="text-sm text-gray-600">Native Swift & SwiftUI</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="text-4xl mb-3">🤖</div>
                    <h3 className="font-semibold mb-2">Android</h3>
                    <p className="text-sm text-gray-600">Kotlin & Jetpack Compose</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="text-4xl mb-3">⚛️</div>
                    <h3 className="font-semibold mb-2">React Native</h3>
                    <p className="text-sm text-gray-600">Cross-platform JavaScript</p>
                </div>
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="text-4xl mb-3">🦋</div>
                    <h3 className="font-semibold mb-2">Flutter</h3>
                    <p className="text-sm text-gray-600">Dart & Material Design</p>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-6">Ready to Build Your App?</h2>
                <p className="text-xl text-gray-600 mb-8">
                    Join thousands of creators who are building the future of mobile apps with AI
                </p>
                
                <a href="/requirements" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 text-lg">
                    🚀 Start Building Now
                </a>

                <p className="text-sm text-gray-500 mt-4">
                    No credit card required • 14-day free trial • Cancel anytime
                </p>
            </div>
        </section>

        <!-- Footer -->
        <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
                © 2024 AI App Builder. Made with ❤️ for developers who want to build amazing mobile apps faster.
            </div>
        </footer>
    </div>

    <script>
        // Direct navigation - no popup
        document.addEventListener('DOMContentLoaded', function() {
            // Let the links work naturally - they'll go to /requirements
            console.log('AI App Builder loaded successfully');
        });
    </script>
</body>
</html>
    </div>
  );
}