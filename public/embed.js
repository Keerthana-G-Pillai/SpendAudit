(function() {
  var iframe = document.createElement('iframe');
  iframe.src = 'https://credex.rocks/widget';
  
  // For local testing, if the script is loaded from localhost:
  if (document.currentScript && document.currentScript.src.includes('localhost')) {
    var url = new URL(document.currentScript.src);
    iframe.src = url.origin + '/widget';
  }

  iframe.style.width = '100%';
  iframe.style.minHeight = '800px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '24px';
  iframe.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
  iframe.setAttribute('allowtransparency', 'true');
  
  // Try to replace the script tag with the iframe
  if (document.currentScript && document.currentScript.parentNode) {
    document.currentScript.parentNode.insertBefore(iframe, document.currentScript);
  } else {
    // Fallback: append to body
    document.body.appendChild(iframe);
  }
})();
