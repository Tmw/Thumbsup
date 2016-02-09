(function (document, window) {

  // predefine all CSS selectors to use
  const SELECTORS = {
    COMMENT_BODY:      '.js-comment-body',
    COMMENT_CONTAINER: '.js-comment-container',
    META_HEADER:       '.gh-header-meta .flex-table-item-primary',
    HIDDEN:            'js-thumbsup-extension-hidden',
    DOTHIDDEN:         '.js-thumbsup-extension-hidden',
    HIDDEN_COUNT:      'thumbsup-hidden-count',
  };

  // grab the comments to work with
  let comments = Array.prototype.slice.call(document.querySelectorAll(SELECTORS.COMMENT_CONTAINER));
  let hiddenLabel;

  // grab the actual comment node from a comment container node
  let grabComment = (node) => {
    return node.querySelector(SELECTORS.COMMENT_BODY);
  };

  // when you remove all the +1 and -1 from the innerText
  // and nothing of value is left, you're out.
  // NOTE: by using innerText all emoji's will be filtered out anyway
  let hasLittleValue = (node) => {
    return grabComment(node).innerText
      .replace(/\+1|\-1/, '')
      .trim() == '';
  };

  // determine if the given node is an actual comment
  let isActualComment = (node) => {
    return grabComment(node) !== null;
  };

  // actually hide the comment
  let hideComment = (node) => {
    node.classList.add(SELECTORS.HIDDEN);
  };

  // show the comment
  let showComment = (node) => {
    node.classList.remove(SELECTORS.HIDDEN);
  };

  // create a label that shows number of hidden entries
  // and gives the user the oppertunity to unhide them
  let showEntries = (nodeCount) => {
    let ghHeaderMeta = document.querySelector(SELECTORS.META_HEADER);
    hiddenLabel = document.createElement('a');
    hiddenLabel.classList.add(SELECTORS.HIDDEN_COUNT);
    hiddenLabel.innerText = `(${nodeCount} hidden)`;
    hiddenLabel.href = '#';
    hiddenLabel.onclick = unhideEntries;

    ghHeaderMeta.appendChild(hiddenLabel);
  };

  // actually unhide the items when requested
  let unhideEntries = (e) => {
    e.preventDefault();
    let hiddenComments = Array.prototype.slice.call(document.querySelectorAll(SELECTORS.DOTHIDDEN));
    hiddenComments.map(showComment);
    hiddenLabel.parentNode.removeChild(hiddenLabel);
  };

  // do the magic
  let meaninglessComments = comments.filter(isActualComment).filter(hasLittleValue).map(hideComment);
  if (meaninglessComments.length) {
    showEntries(meaninglessComments.length);
  }

})(document, window);
