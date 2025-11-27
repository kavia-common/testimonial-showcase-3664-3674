#!/bin/bash
cd /home/kavia/workspace/code-generation/testimonial-showcase-3664-3674/testimonial_section_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

