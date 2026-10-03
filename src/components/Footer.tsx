import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-border-custom py-8 mt-12 bg-bg-main">
      <div className="max-w-4xl mx-auto px-6 text-center text-sm text-zinc-600">
        &copy; {new Date().getFullYear()} YoursPrompt. All rights reserved.
      </div>
    </footer>
  );
}
