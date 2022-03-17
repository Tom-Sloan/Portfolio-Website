import React from "react";

export function TestData({ numberOfRepeat }) {
  return (
    <div>
      {Array(numberOfRepeat)
        .fill()
        .map((v, i) => (
          <div key={'para'+i}>
            Officia incididunt qui Lorem esse quis excepteur deserunt nisi
            veniam aliquip irure. Tempor velit deserunt reprehenderit
            exercitation esse nulla non pariatur qui excepteur. Dolor non ad
            veniam et aliqua labore
          </div>
        ))}
    </div>
  );
}
