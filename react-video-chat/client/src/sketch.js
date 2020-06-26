import React, { useRef, useEffect } from "react";
import Sketch from "react-p5";
import io from "socket.io-client";
const SketchPage = () => {
  const socket = useRef();

  function mouseDragged(P5) {
    // Draw
    P5.stroke("black");
    // P5.strokeWeight(strokeWidth);
    if (P5.mouseIsPressed) {
      P5.line(P5.mouseX, P5.mouseY, P5.pmouseX, P5.pmouseY);
      sendmouse(P5.mouseX, P5.mouseY, P5.pmouseX, P5.pmouseY);
    }

    // Send the mouse coordinates
  }

  // Sending data to the socket.current
  function sendmouse(x, y, pX, pY) {
    const data = {
      x: x,
      y: y,
      px: pX,
      py: pY,
      // color: color,
      // strokeWidth: strokeWidth,
    };
    console.log("SEND CORDINATOR", data);

    socket.current.emit("mouse", data);
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 500).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    p5.background(233, 233, 233);

    socket.current.on("mouse", (data) => {
      p5.line(data.x, data.y, data.px, data.py);
    });
  };

  useEffect(() => {
    socket.current = io.connect("http://localhost:8000");
    console.log("Skect Awal run");
  }, []);
  return (
    <div>
      <h1>Drawing page</h1>
      <Sketch setup={setup} draw={mouseDragged} />;
    </div>
  );
};

export default SketchPage;
