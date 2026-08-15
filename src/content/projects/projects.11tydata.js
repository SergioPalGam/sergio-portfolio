module.exports = {
  tags: ["project"],
  layout: "layouts/project.njk",
  eleventyComputed: {
    permalink: data => `/projects/${data.page.fileSlug}/index.html`
  }
};
