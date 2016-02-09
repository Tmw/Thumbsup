(function (document, window) {
  let comments = Array.prototype.slice.call(document.querySelectorAll('.js-comment-container'));
  let hiddenLabel;

  let grabComment = (node) => {
    return node.querySelector('.js-comment-body');
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
    node.classList.add('js-thumbsup-extension-hidden');
  };

  // show the comment
  let showComment = (node) => {
    node.classList.remove('js-thumbsup-extension-hidden');
  };

  // create a label that shows number of hidden entries
  // and gives the user the oppertunity to unhide them
  let showEntries = (nodeCount) => {
    let ghHeaderMeta = document.querySelector('.gh-header-meta .flex-table-item-primary');
    hiddenLabel = document.createElement('a');
    hiddenLabel.classList.add('thumbsup-hidden-count');
    hiddenLabel.innerText = `(${nodeCount} hidden)`;
    hiddenLabel.href = '#';
    hiddenLabel.onclick = unhideEntries;

    ghHeaderMeta.appendChild(hiddenLabel);
  };

  // actually unhide the items when requested
  let unhideEntries = (e) => {
    e.preventDefault();
    let hiddenComments = Array.prototype.slice.call(document.querySelectorAll('.js-thumbsup-extension-hidden'));
    hiddenComments.map(showComment);
    hiddenLabel.parentNode.removeChild(hiddenLabel);
  };

  // do the magic
  let meaninglessComments = comments.filter(isActualComment).filter(hasLittleValue).map(hideComment);
  if (meaninglessComments.length) {
    showEntries(meaninglessComments.length);
  }

})(document, window);
