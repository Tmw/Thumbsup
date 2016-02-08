// create a map of possible comment types
const CommentTypes = {
  meaningFul: 'This is the first comment thus it is the issue body',
  thumbsUp: '<img src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png">',
  plusOne: '+1',
  minusOne: '-1',
  thumbsDown: '<img src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44e.png">',
};

// create a default DOM which defaults to every comment type
const setupDOM = (comments = [CommentTypes.meaningFul, CommentTypes.thumbsUp, CommentTypes.thumbsDown, CommentTypes.plusOne, CommentTypes.minusOne]) => {
  // setup the basic HTML to work with
  let metadata = `
    <div class="flex-table gh-header-meta">
      <div class="flex-table-item flex-table-item-primary">
        <a href="/tmw" class="author">tmw</a> opened this <span class="noun">Issue</span> <time datetime="2016-02-07T08:36:18Z" is="relative-time" title="Feb 7, 2016, 9:36 AM GMT+1">on Feb 07, 2016</time>
        · 5 comments
      </div>
    </div>
  `;

  let discussion = `
    <div class="js-discussion js-socket-channel" data-channel="tmw/thumbsup">
    </div>
  `;

  document.body.innerHTML = metadata + discussion;
  comments.map(createComment);
};

// Create a single comment and append it to the DOM
const createComment = (body) => {
  document.querySelector('.js-discussion').innerHTML += `
    <div class="timeline-comment-wrapper js-comment-container">
     <a href="/tmw"><img alt="@tmw" class="timeline-comment-avatar" height="48" src="" width="48"></a>
     <div id="issue-58450162" class="comment previewable-edit timeline-comment js-comment js-task-list-container " data-body-version="c51c6b350e96fd9eaf6c315aa8b0e7b1">
        <div class="timeline-comment-header ">
           <div class="timeline-comment-header-text">
              <strong>
              <a href="/tmw" class="author">Tmw</a>
              </strong>
              commented
              <a href="#issue-58450162" class="timestamp">
                <time datetime="2016-02-07T08:36:18Z" is="relative-time" title="Feb 7, 2016, 9:36 AM GMT+1">on Feb 07, 2016</time>
              </a>
           </div>
        </div>
        <div class="comment-content">
           <div class="edit-comment-hide">
              <div class="comment-body markdown-body markdown-format js-comment-body">
                 <p>${body}</p>
              </div>
           </div>
        </div>
     </div>
  </div>`;
};

// dynamically load the extenion to our test DOM
const includeExtension = (done) => {
  let scriptTag = document.createElement('script');
  scriptTag.src = 'base/src/common/main.js';
  scriptTag.type = 'text/javascript';
  scriptTag.onload = done;
  document.body.appendChild(scriptTag);
};

describe('setting up the test DOM', () => {
  beforeAll(() => {
    setupDOM();
  });

  it('should have a metadata header', () => {
    expect(document.querySelectorAll('.gh-header-meta').length).toBe(1);
  });

  it('should have five comments', () => {
    expect(document.querySelectorAll('.js-comment-container').length).toBe(5);
  });

  it('should read 5 comments total', () => {
    let contents = document.querySelector('.flex-table-item-primary').innerText;
    expect(contents.match(/5 comments/).length).toBe(1);
  });

});

describe('hiding meaningless comments', () => {
  let comments;
  beforeAll((done) => {
    setupDOM();
    includeExtension(() => {
      // grab reference to the comments
      comments = Array.prototype.slice.call(document.querySelectorAll('.js-comment-container'));

      // tell jasmine we're ready to move on
      done();
    });
  });

  it('should hide +1/-1 only comments', () => {
    expect(comments[1].classList[2]).toBe('js-thumbsup-extension-hidden');
    expect(comments[2].classList[2]).toBe('js-thumbsup-extension-hidden');
  });

  it('should hide emoji only comments', () => {
    expect(comments[3].classList[2]).toBe('js-thumbsup-extension-hidden');
    expect(comments[4].classList[2]).toBe('js-thumbsup-extension-hidden');
  });

  it('should not hide comments with possible meaning', () => {
    expect(comments[0].classList[2]).not.toBe('js-thumbsup-extension-hidden');
  });
});

describe('showing the (... hidden) label', () => {
  beforeAll((done) => {
    setupDOM();
    includeExtension(done);
  });

  it('should show a label saying how many comments are hidden', () => {
    let label = document.querySelector('.thumbsup-hidden-count');
    expect(label.innerText).toMatch(/4 hidden/);
  });

});

describe('not showing the (... hidden) label', () => {
  beforeAll((done) => {
    // create a DOM with only meaningful comments
    setupDOM([CommentTypes.meaningFul, CommentTypes.meaningFul, CommentTypes.meaningFul]);
    includeExtension(done);
  });

  it('shouldn\'t show a label when no comments are filtered', () => {
    let label = document.querySelector('.thumbsup-hidden-count');
    expect(label).toBe(null);
  });
});

describe('clicking the (... hidden) label', () => {
  let comments;
  beforeAll((done) => {
    setupDOM();
    includeExtension(() => {
      // clicking the actual label
      let label = document.querySelector('.thumbsup-hidden-count');
      let event = new Event('click');
      label.dispatchEvent(event);

      // get reference to the comments
      comments = Array.prototype.slice.call(document.querySelectorAll('.js-comment-container'));

      // tell jasmine we're ready to move on
      done();
    });
  });

  it('should show all comments when clicking the label', () => {
    expect(comments[0].classList[2]).not.toBe('js-thumbsup-extension-hidden');
    expect(comments[1].classList[2]).not.toBe('js-thumbsup-extension-hidden');
    expect(comments[2].classList[2]).not.toBe('js-thumbsup-extension-hidden');
    expect(comments[3].classList[2]).not.toBe('js-thumbsup-extension-hidden');
    expect(comments[4].classList[2]).not.toBe('js-thumbsup-extension-hidden');
  });

  it('should remove the label from the DOM', () => {
    let label = document.querySelector('.thumbsup-hidden-count');
    expect(label).toBe(null);
  });
});
