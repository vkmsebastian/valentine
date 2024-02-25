import React from 'react';
// import './HeartAnimation.css'; // Import CSS file for component styling

// function altBackground(){
//   return {
//       @media screen and max-width(600px){
//         display:'none'
//       }

    
//   };
// }

const HeartAnimation = () => {
  return (
    <div className="backgroundComponent">
    <css-doodle>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n  --color: #51eaea, #fffde1, #ff9d76, #FB3569;\n\n  @grid: 30x1 / 100vw 100vh / #270f34; \n  \n  :container {\n    perspective: 30vmin;\n    --deg: @p(-180deg, 180deg);\n  }\n  \n  :after, :before {\n    content: '';\n    background: @p(--color); \n    @place: @r(100%) @r(100%);\n    @size: @r(6px);\n    @shape: heart;\n  }\n\n  @place: center;\n  @size: 18vmin; \n\n  box-shadow: @m2(0 0 50px @p(--color));\n  background: @m100(\n    radial-gradient(@p(--color) 50%, transparent 0) \n    @r(-20%, 120%) @r(-20%, 100%) / 1px 1px\n    no-repeat\n  );\n\n  will-change: transform, opacity;\n  animation: scale-up 12s linear infinite;\n  animation-delay: calc(-12s / @I * @i);\n\n  @keyframes scale-up {\n    0%, 95.01%, 100% {\n      transform: translateZ(0) rotate(0);\n      opacity: 0;\n    }\n    10% { \n      opacity: 1; \n    }\n    95% {\n      transform: \n        translateZ(35vmin) rotateZ(var(--deg));\n    }\n  }\n"
    }}
  />
</css-doodle>
</div>
  );
};

export default HeartAnimation;
