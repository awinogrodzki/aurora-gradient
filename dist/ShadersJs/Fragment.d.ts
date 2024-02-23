declare const _default: "varying vec3 v_color;\n\nvoid main() {\n    vec3 color = v_color;\n    if (u_darken_top == 1.0) {\n        vec2 st = gl_FragCoord.xy/resolution.xy;\n        color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;\n    }\n    gl_FragColor = vec4(color, 1.0);\n}\n";
export default _default;
