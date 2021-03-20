import React, { useRef, useEffect } from 'react'



const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  const draw = (gl, canvas) => {
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

         // Enable the depth test
         gl.enable(gl.DEPTH_TEST);
 
         // Clear the color buffer bit
         gl.clear(gl.COLOR_BUFFER_BIT);

         // Set the view port
         gl.viewport(0,0,canvas.width,canvas.height);

         // Draw the triangle
         gl.drawArrays(gl.POINTS, 0, 3);
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    canvas.width = window.innerWidth - 2; 
    canvas.height = window.innerHeight - 3;
    const context = canvas.getContext('webgl')

    var vertex_buffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertex_buffer);
    var vertices = [
        -0.5,0.5,0.0,
        0.0,0.5,0.0,
        -0.25,0.25,0.0, 
     ];
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    var vertCode = 'attribute vec3 coordinates;' +

    'void main(void) {' +
       ' gl_Position = vec4(coordinates, 1.0);' +
       'gl_PointSize = 10.0;'+
    '}';

    var vertShader = context.createShader(context.VERTEX_SHADER);

    context.shaderSource(vertShader, vertCode);

    var fragCode =
            'void main(void) {' +
               ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
            '}';

    var fragShader = context.createShader(context.FRAGMENT_SHADER);

    // Attach fragment shader source code
    context.shaderSource(fragShader, fragCode);

    // Compile the fragmentt shader
    context.compileShader(fragShader);
    
    // Create a shader program object to store
    // the combined shader program
    var shaderProgram = context.createProgram();

    // Attach a vertex shader
    context.attachShader(shaderProgram, vertShader); 

    // Attach a fragment shader
    context.attachShader(shaderProgram, fragShader);

    // Link both programs
    context.linkProgram(shaderProgram);

    // Use the combined shader program object
    context.useProgram(shaderProgram);

    /*======== Associating shaders to buffer objects ========*/

    // Bind vertex buffer object
    context.bindBuffer(context.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = context.getAttribLocation(shaderProgram, "coordinates");

    // Point an attribute to the currently bound VBO
    context.vertexAttribPointer(coord, 3, context.FLOAT, false, 0, 0);

    // Enable the attribute
    context.enableVertexAttribArray(coord);


    let animationFrameId
    
    //Our draw came here
    const render = () => {
      draw(context, canvas)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
  return <canvas ref={canvasRef} {...props} width="640" height="480"/>
}

export default Canvas