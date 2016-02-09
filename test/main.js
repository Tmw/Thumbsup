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
  const metadata = `
    <div class="flex-table gh-header-meta">
      <div class="flex-table-item flex-table-item-primary">
        <a href="/tmw" class="author">tmw</a> opened this <span class="noun">Issue</span> <time datetime="2016-02-07T08:36:18Z" is="relative-time" title="Feb 7, 2016, 9:36 AM GMT+1">on Feb 07, 2016</time>
        · 5 comments
      </div>
    </div>
  `;

  const discussion = `
    <div class="js-discussion js-socket-channel" data-channel="tmw/thumbsup">
    </div>
  `;

  const newCommentBox = `
    <div class="discussion-timeline-actions">
       <div class="timeline-comment-wrapper timeline-new-comment js-comment-container ">
          <a href="/Tmw"><img alt="@Tmw" class="timeline-comment-avatar" height="48" src="https://avatars1.githubusercontent.com/u/639858?v=3&amp;s=96" width="48"></a>
          <form accept-charset="UTF-8" action="/someaction" class="js-new-comment-form" data-form-nonce="blabla" data-remote="true" data-type="json" method="post">
             <div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="✓"><input name="authenticity_token" type="hidden" value="blabla/blabla"></div>
             <div class="timeline-comment">
                <input type="hidden" name="issue" value="1320">
                <div class="js-suggester-container js-previewable-comment-form previewable-comment-form write-selected" data-preview-url="/preview?markdown_unsupported=false&amp;repository=2560988&amp;subject=1320&amp;subject_type=Issue">
                   <div class="comment-form-head tabnav">
                      <div class="js-toolbar toolbar-commenting">

                      </div>
                   </div>
                   <div class="comment-form-error js-comment-form-error" style="display:none">    There was an error creating your Issue.</div>
                   <div class="write-content js-write-bucket js-uploadable-container js-upload-markdown-image upload-enabled is-default" data-upload-policy-url="/upload/policies/assets" data-upload-repository-id="2560988">
                      <textarea name="comment[body]" tabindex="1" id="new_comment_field" placeholder="Leave a comment" aria-label="Comment body" class="input-contrast comment-form-textarea js-comment-field js-improved-comment-field js-task-list-field js-quick-submit js-size-to-fit js-suggester-field js-quote-selection-target js-session-resumable"></textarea>
                      <div class="suggester-container">
                         <div class="suggester js-suggester js-navigation-container" data-url="/karma-runner/karma/suggestions/issue/58450162">
                         </div>
                      </div>
                   </div>
                   <div class="comment-form-error comment-form-bottom js-comment-update-error"></div>
                </div>
                <div class="form-actions">
                   <div id="partial-new-comment-form-actions" class="js-socket-channel js-updatable-content" data-channel="karma-runner/karma:issue:58450162:state" data-url="/karma-runner/karma/issues/1320/show_partial?partial=issues%2Fform_actions">
                      <button type="submit" class="btn btn-primary" tabindex="2" data-disable-with="" data-disable-invalid="">
                      Comment
                      </button>
                   </div>
                </div>
             </div>
          </form>
       </div>
    </div>
  `;

  document.body.innerHTML = metadata + discussion + newCommentBox;
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
    // 5 actual comments and one new comment box
    expect(document.querySelectorAll('.js-comment-container').length).toBe(6);
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
