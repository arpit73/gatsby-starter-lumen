---
title: Google Summer Of Code 2019 Work Report
date: "2018-08-26T23:46:37.121Z"
template: "post"
draft: false
slug: "/posts/Arpit-Bharti-GSoC-2019-Report/"
category: "Programming"
tags:
  - "GSOC"
  - "Mozilla"
  - "Open Source"
description: "The work that I did at mozilla for Google Summer of Code 2019"
---

### Project - Ship the Public Suffix List (PSL) over Remote Settings

**Organization - Mozilla**

**Project Mentor - Mathieu Leplatre**
  
**Summary**

An update to the public suffix list (PSL) is shipped bundled with Firefox releases. The current system creates the DAFSA binary file at build time. The list has to be manually updated with every new release and cannot be updated for people running old versions of Firefox. I will be working to create an update system using the remote-settings API in Firefox to deliver an updated list to the client periodically, the period is yet to be determined. The list will be published on the Mozilla remote-settings servers and be shipped as a binary. This file format allows for shipping the list quickly over the network as it is orders of magnitude smaller in size an can be parsed much faster than raw text.

For more in depth details, view the <a href="https://docs.google.com/document/d/1kxlAhu87MQtATxYfBdfRO-WjMHVNo1jA9Gr5mdVBnN8/edit?usp=sharing">Blueprint Document</a>.


### Contributions


<table>
  <th>Merge Requests</th>
  <tr>
    <td>
      <small><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1083971">Bugzilla - 1083971</a></small>
      <br>
      <b>
        <a href="https://github.com/mozilla-services/remote-settings-lambdas/pull/373">Publishing Public Suffix
          List as a DAFSA binary
        </a>
      </b>
      <br>
      <br>
      <p>
        This first pull request involved commits to the remote-settings-lambdas repository, I created a new python script, <a href="https://github.com/mozilla-services/remote-settings-lambdas/blob/master/commands/publish_dafsa.py">publish_dafsa.py</a>, that is supposed to run periodically to check for any new commits made to the <a href="https://github.com/publicsuffix/list">publicsuffix/list</a> repository, particularly just the <a href="https://github.com/publicsuffix/list/blob/master/public_suffix_list.dat">public_suffix_list.dat</a> file. If we observe any changes, we will download the required resources and compile a new updated dafsa (using the modified script mentioned in the following merge request below).
        This new file, along with last commit hash for the <a href="https://github.com/publicsuffix/list/blob/master/public_suffix_list.dat">public_suffix_list.dat</a> file, is then uploaded to the Remote Settings server, to be downloaded by Firefox clients all over the world.
        This requests also has tests to ensure correct behavior.
      </p>
    </td>
  </tr>
  <tr>
    <td>
      <small><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1083971">Bugzilla - 1083971</a>
      </small>
      <br>
      <b>
        <a href="https://phabricator.services.mozilla.com/D34364">Bug 1083971 - Add an option to output a binary file
          for the PSL data
        </a>
      </b>
      <br>
        <a href="https://hg.mozilla.org/mozilla-central/rev/822cb68b6ab7">Patch</a>
        <br>
      <p>
        The resources used for compiling a dafsa binary are pulled directly from <a href="https://hg.mozilla.org/mozilla-central/">mozilla-central</a>, namely <a href="https://searchfox.org/mozilla-central/source/netwerk/dns/prepare_tlds.py">prepare_tlds.py</a> and <a href="https://searchfox.org/mozilla-central/source/xpcom/ds/tools/make_dafsa.py">make_dafsa.py</a>, however they could only output a <a href="https://searchfox.org/mozilla-central/source/__GENERATED__/netwerk/dns/etld_data.inc">hex array</a> and had no options to output a binary representation of the data. I modified the scripts for the above purpose and ensured compatibility across python versions, since the remote-settings-lambdas uses Python 3.7 while the Firefox build system is still using the now EOL Python 2.7.
      </p>
    </td>
  </tr>
  <tr>
    <td>
      <small>
      <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1083971">Bugzilla - 1083971</a>
      </small>
      <br>
      <b>
        <a href="https://github.com/mozilla-services/remote-settings-lambdas/pull/431">Links for prepare_tlds.py &
          make_dafsa.py updated to pull from mozilla-central
        </a>
      </b>
        <br>
        <br>
      <p>
        A very small pull request to update the links that will be used to pull <a href="https://hg.mozilla.org/mozilla-central/raw-file/822cb68b6ab75c96d7e36aa1f7fffda122d41f0c/netwerk/dns/prepare_tlds.py">prepare_tlds.py</a> and <a href="https://hg.mozilla.org/mozilla-central/raw-file/27de3a352a395fd4fac5964d1027a3144e28224b/xpcom/ds/tools/make_dafsa.py">make_dafsa.py</a> from a certain revision in mozilla-central. This could only have been done after the previous patch for generating binary file had landed.
      </p>
    </td>
  </tr>
  <tr>
    <td>
      <small><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1563226">Bugzilla - 1563226</a>
      </small>
      <br>
      <b>
        <a href="https://phabricator.services.mozilla.com/D42469">Bug 1563226 - Download the Public Suffix List using
          Remote Settings
        </a>
      </b>
        <br>
              <a href="https://hg.mozilla.org/mozilla-central/rev/3c352981d6c4">Patch</a>
        <br>
      <p>
        Using the Remote Settings API we download the latest binary file (`dafsa.bin`) from the Remote Settings server and write it to the user profile folder. This happens when the user is idle so we can avoid disk I/O at firefox startup. We also check for updates while firefox is running. In both cases the newly downloaded dafsa binary is written to disk and we send a signal to C++ with object reference to the file, an identifier string for the signal and a handle to the file (although this will be of use only in the following merge request).
        This patch also has tests for asserting correct behavior, ie. signal is correctly sent in every event and fails loudly.
        For the purpuses of tests written in this patch and the next patch, at build time we create a fake dafsa binary file, a reference object to this file and full path is sent in the signal for asserting correct behavior.
      </p>
    </td>
  </tr>
  <tr>
    <td>
      <small><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1563246">Bugzilla - 1563246</a>
      </small>
      <br>
      <b>
        <a href="https://phabricator.services.mozilla.com/D42470">Bug 1563246 - Reload the Public Suffix List when data
          is updated in profile folder
        </a>
      </b>
        <br>
              <a href="https://hg.mozilla.org/mozilla-central/rev/03c9cce08d11">Patch</a>
        <br>
      <p>
        Finally the reloading of dafsa is handled in this patch, <a href="https://searchfox.org/mozilla-central/source/netwerk/dns/nsEffectiveTLDService.h">nsEffectiveTLDService.h</a> is modified to act as a observer for signals sent to the C++ code. After successfully receiving the signal we take the file and memory map it, ie. dump the bytes into memory. This is done considering the multiprocess execution of Firefox. If we memory map it from the parent process the child processes will have access to the data for free and we avoid unneccesary file reading operations that would have taken place in child processes. We also have to consider the safety of data in when mutiple processes can read and modify the data. So we use <a href="https://searchfox.org/mozilla-central/source/xpcom/threads/RWLock.h">RWLock</a> to ensure there is a lock on the memory while reading and writing so it doesn't change midway if a another process attempts to access it.
        We also reset the cache here to ensure new cache is created with the new dafsa data.
        For tests we use the same fake dafsa binary we created in the previous patch, that binary was built with a much smaller fake suffix list which contained a fake suffix of our choice, in the test we send a signal with reference to this file and assert that our fake suffix is known after reloading the fake dafsa.
      </p>
    </td>
  </tr>
</table>

#### Side Project

-   <p><a href="https://github.com/arpit73/dafsaBinary-to-hexArray">Convert a binary file into a C++ array of hexadecimal numbers</a>, this was a short exercise to get comfortable working with C++ and understand firsthand how the binary will be converted into a hex array, the first few iterations of my last patch were following the approach here but on sugesstion of the other developers I used another method that didn't involve filestream operations.
</p>

#### Issues I opened

-   <p><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1552658">Fix to make prepare_tlds.py run on Python 3</a> this was minor patch that I needed in order to ensure identical behavior with Python 2 and Python 3, I reported the issue and provided a solution as such the issue was marked as a good first bug for beginners.</p>

-   <p><a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1574145">Cannot push binary file with moz-phab</a> This a was bug I encountered with `moz-phab`, the utility used for submitting patches to phabricator. The program would freeze when I attempted to push a binary file in my revision. The issues remains unresolved and I found a work around by creating a binary file at build time.</p>